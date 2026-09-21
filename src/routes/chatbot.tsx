import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { AppShell, Painel } from "@/components/AppShell";
import { responderCliente } from "@/lib/ai.functions";
import { conversasDemo } from "@/lib/demo";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "Chatbot 24h — Orbita" },
      {
        name: "description",
        content: "Atendimento automático com IA para responder clientes a qualquer hora do dia.",
      },
      { property: "og:title", content: "Chatbot 24h — Orbita" },
      { property: "og:description", content: "Atendimento com IA para sua loja, 24 horas por dia." },
    ],
  }),
  component: Chatbot,
});

type Mensagem = { autor: "cliente" | "ia"; texto: string };

const sugestoes = [
  "Qual o prazo de entrega para São Paulo?",
  "Quero trocar o tamanho 38 por 40.",
  "O cupom ORBITA10 ainda vale?",
];

function Chatbot() {
  const responder = useServerFn(responderCliente);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { autor: "ia", texto: "Oi! Sou o atendimento da loja. Posso ajudar com pedidos, prazos, trocas e pagamento." },
  ]);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fim = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, pensando]);

  useEffect(() => {
    campo.current?.focus();
  }, [pensando]);

  async function enviar(pergunta: string) {
    const limpa = pergunta.trim();
    if (!limpa || pensando) return;
    setErro(null);
    setTexto("");
    const historico = mensagens;
    setMensagens([...historico, { autor: "cliente", texto: limpa }]);
    setPensando(true);
    try {
      const r = await responder({
        data: { pergunta: limpa, historico, loja: "Orbita Store" },
      });
      setMensagens((m) => [...m, { autor: "ia", texto: r.texto }]);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "O atendimento não respondeu agora.");
    } finally {
      setPensando(false);
    }
  }

  return (
    <AppShell titulo="Chatbot 24h" subtitulo="Atendimento com IA para suporte e vendas">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Painel className="xl:col-span-2 flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-snow">Conversa de teste</h2>
            <span className="rounded-full bg-volt/15 px-2.5 py-1 text-[11px] font-semibold text-volt">online</span>
          </div>

          <div className="mt-4 h-[380px] space-y-3 overflow-y-auto pr-1">
            {mensagens.map((m, i) => (
              <div key={i} className={m.autor === "cliente" ? "flex justify-end" : "flex justify-start"}>
                <p
                  className={
                    m.autor === "cliente"
                      ? "max-w-[80%] rounded-[14px] rounded-tr-sm bg-volt px-3 py-2 text-[13px] text-ink"
                      : "max-w-[80%] rounded-[14px] rounded-tl-sm border border-line/50 bg-ink-2/50 px-3 py-2 text-[13px] text-mist"
                  }
                >
                  {m.texto}
                </p>
              </div>
            ))}
            {pensando && <p className="text-[12px] text-fog">digitando…</p>}
            <div ref={fim} />
          </div>

          {erro && <p className="mt-2 rounded-[10px] bg-destructive/15 px-3 py-2 text-[12px] text-snow">{erro}</p>}

          <div className="mt-3 flex flex-wrap gap-2">
            {sugestoes.map((s) => (
              <button
                key={s}
                onClick={() => enviar(s)}
                className="rounded-full border border-line/60 px-3 py-1.5 text-[11px] text-fog hover:bg-snow/5"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void enviar(texto);
            }}
            className="mt-3 flex items-center gap-2"
          >
            <input
              ref={campo}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva como se fosse um cliente…"
              className="flex-1 rounded-[10px] border border-line/60 bg-ink-2/50 px-3 py-2.5 text-[13px] text-snow outline-none placeholder:text-fog/50 focus:ring-2 focus:ring-volt/40"
            />
            <button
              type="submit"
              disabled={pensando}
              className="rounded-[10px] bg-volt px-4 py-2.5 text-[13px] font-semibold text-ink ring-1 ring-volt/40 disabled:opacity-60"
            >
              Enviar
            </button>
          </form>
        </Painel>

        <Painel>
          <h2 className="font-display text-base font-semibold text-snow">Conversas recentes</h2>
          <p className="text-[12px] text-fog">Exemplos de atendimentos dos seus canais</p>
          <div className="mt-4 divide-y divide-line/50">
            {conversasDemo.map((c) => (
              <div key={c.cliente} className="py-3">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-snow">{c.cliente}</p>
                  <p className="text-[11px] text-fog">{c.tempo}</p>
                </div>
                <p className="mt-0.5 text-[12px] text-fog">“{c.texto}”</p>
                <span
                  className={
                    c.status === "resolvido"
                      ? "mt-2 inline-block rounded-full bg-volt/15 px-2 py-0.5 text-[10px] font-semibold text-volt"
                      : "mt-2 inline-block rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-semibold text-amber"
                  }
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </Painel>
      </div>
    </AppShell>
  );
}
