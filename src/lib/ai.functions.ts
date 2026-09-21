import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

function apiKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Configuração de IA ausente.");
  return key;
}

async function chat(messages: Array<{ role: string; content: string }>) {
  const response = await fetch(`${GATEWAY}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      reasoning_effort: "low",
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    if (response.status === 429) throw new Error("Muitas solicitações agora. Tente de novo em instantes.");
    if (response.status === 402) throw new Error("Os créditos de IA acabaram. Adicione créditos para continuar.");
    throw new Error(`A IA não respondeu (${response.status}). ${detail.slice(0, 160)}`);
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let text = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const parsed = JSON.parse(payload);
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (typeof delta === "string") text += delta;
      } catch {
        // ignore partial frames
      }
    }
  }
  return text.trim();
}

const ConteudoInput = z.object({
  nome: z.string().min(2),
  detalhes: z.string().default(""),
  canal: z.string().default("Shopee"),
});

export const gerarConteudo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ConteudoInput.parse(input))
  .handler(async ({ data }) => {
    const raw = await chat([
      {
        role: "system",
        content:
          "Você é especialista em anúncios de e-commerce no Brasil. Responda SEMPRE em JSON puro, sem markdown, no formato {\"titulo\":\"...\",\"descricao\":\"...\",\"palavras_chave\":\"...\",\"prompt_foto\":\"...\"}. Título com até 120 caracteres otimizado para busca. Descrição com 3 a 5 frases vendedoras em português do Brasil. palavras_chave com 6 termos separados por vírgula. prompt_foto em inglês, descrevendo uma foto de estúdio do produto.",
      },
      {
        role: "user",
        content: `Produto: ${data.nome}\nDetalhes: ${data.detalhes || "sem detalhes extras"}\nCanal de venda: ${data.canal}`,
      },
    ]);

    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    try {
      const parsed = JSON.parse(cleaned) as {
        titulo?: string;
        descricao?: string;
        palavras_chave?: string;
        prompt_foto?: string;
      };
      return {
        titulo: parsed.titulo ?? data.nome,
        descricao: parsed.descricao ?? cleaned,
        palavras_chave: parsed.palavras_chave ?? "",
        prompt_foto: parsed.prompt_foto ?? `studio product photo of ${data.nome}`,
      };
    } catch {
      return {
        titulo: data.nome,
        descricao: cleaned,
        palavras_chave: "",
        prompt_foto: `studio product photo of ${data.nome}`,
      };
    }
  });

const FotoInput = z.object({ prompt: z.string().min(3) });

export const gerarFoto = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => FotoInput.parse(input))
  .handler(async ({ data }) => {
    const response = await fetch(`${GATEWAY}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "lovable/image-fast",
        prompt: `${data.prompt}. Clean e-commerce product photography, soft gradient backdrop, high detail.`,
        size: "1024x1024",
        n: 1,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      if (response.status === 402) throw new Error("Os créditos de IA acabaram. Adicione créditos para gerar fotos.");
      throw new Error(`Não consegui gerar a foto (${response.status}). ${detail.slice(0, 160)}`);
    }

    const json = (await response.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
    };
    const item = json.data?.[0];
    if (item?.b64_json) return { imagem: `data:image/png;base64,${item.b64_json}` };
    if (item?.url) return { imagem: item.url };
    throw new Error("A IA não devolveu nenhuma imagem.");
  });

const AtendimentoInput = z.object({
  pergunta: z.string().min(1),
  historico: z
    .array(z.object({ autor: z.string(), texto: z.string() }))
    .default([]),
  loja: z.string().default("nossa loja"),
});

export const responderCliente = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AtendimentoInput.parse(input))
  .handler(async ({ data }) => {
    const texto = await chat([
      {
        role: "system",
        content: `Você é o atendente virtual da loja "${data.loja}", disponível 24 horas. Responda em português do Brasil, com no máximo 4 frases, tom cordial e objetivo. Ajude com prazos de entrega, trocas, pagamento, rastreio e dúvidas de produto. Quando não souber algo específico do pedido, peça o número do pedido. Nunca invente prazos exatos sem o CEP; ofereça a estimativa e o próximo passo.`,
      },
      ...data.historico.map((m) => ({
        role: m.autor === "cliente" ? "user" : "assistant",
        content: m.texto,
      })),
      { role: "user", content: data.pergunta },
    ]);
    return { texto };
  });
