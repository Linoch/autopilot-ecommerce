import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AppShell, Painel } from "@/components/AppShell";
import { gerarConteudo, gerarFoto } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import produtoDemo from "@/assets/produto-demo.jpg";

export const Route = createFileRoute("/conteudo")({
  head: () => ({
    meta: [
      { title: "Gerador de conteúdo — Orbita" },
      {
        name: "description",
        content: "Crie título, descrição e foto de produto com inteligência artificial em segundos.",
      },
      { property: "og:title", content: "Gerador de conteúdo — Orbita" },
      { property: "og:description", content: "Título, descrição e foto de produto criados por IA." },
    ],
  }),
  component: Conteudo,
});

type Salvo = { id: string; nome: string; titulo: string | null; created_at: string };

function Conteudo() {
  const criarConteudo = useServerFn(gerarConteudo);
  const criarFoto = useServerFn(gerarFoto);

  const [nome, setNome] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [canal, setCanal] = useState("Shopee");

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [palavras, setPalavras] = useState("");
  const [promptFoto, setPromptFoto] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);

  const [gerando, setGerando] = useState(false);
  const [gerandoFoto, setGerandoFoto] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [salvos, setSalvos] = useState<Salvo[]>([]);

  async function carregarSalvos() {
    const { data } = await supabase
      .from("produtos")
      .select("id,nome,titulo,created_at")
      .order("created_at", { ascending: false })
      .limit(8);
    setSalvos((data as Salvo[]) ?? []);
  }

  useEffect(() => {
    void carregarSalvos();
  }, []);

  async function gerar() {
    if (nome.trim().length < 2) {
      setErro("Escreva o nome do produto.");
      return;
    }
    setErro(null);
    setAviso(null);
    setGerando(true);
    try {
      const r = await criarConteudo({ data: { nome, detalhes, canal } });
      setTitulo(r.titulo);
      setDescricao(r.descricao);
      setPalavras(r.palavras_chave);
      setPromptFoto(r.prompt_foto);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não consegui gerar agora.");
    } finally {
      setGerando(false);
    }
  }

  async function foto() {
    setErro(null);
    setGerandoFoto(true);
    try {
      const r = await criarFoto({ data: { prompt: promptFoto || `produto ${nome}` } });
      setImagem(r.imagem);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não consegui gerar a foto agora.");
    } finally {
      setGerandoFoto(false);
    }
  }

  async function salvar() {
    setErro(null);
    const { error } = await supabase.from("produtos").insert({
      nome,
      titulo,
      descricao,
      palavras_chave: palavras,
      canais: [canal],
    });
    if (error) {
      setErro("Não consegui salvar o produto.");
      return;
    }
    setAviso("Produto salvo na sua loja.");
    void carregarSalvos();
  }

  return (
    <AppShell titulo="Gerador de conteúdo" subtitulo="Título, descrição e foto prontos em segundos">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Painel>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-snow">Sobre o produto</h2>
            <span className="rounded-full bg-volt/15 px-2.5 py-1 text-[11px] font-semibold text-volt">IA</span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-fog">Nome do produto</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Tênis de corrida leve"
                className="mt-1.5 w-full rounded-[10px] border border-line/60 bg-ink-2/50 px-3 py-2.5 text-[13px] text-snow outline-none placeholder:text-fog/50 focus:ring-2 focus:ring-volt/40"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-fog">Detalhes</label>
              <textarea
                value={detalhes}
                onChange={(e) => setDetalhes(e.target.value)}
                rows={4}
                placeholder="Materiais, tamanhos, público, diferenciais…"
                className="mt-1.5 w-full rounded-[10px] border border-line/60 bg-ink-2/50 px-3 py-2.5 text-[13px] text-snow outline-none placeholder:text-fog/50 focus:ring-2 focus:ring-volt/40"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-fog">Canal</label>
              <select
                value={canal}
                onChange={(e) => setCanal(e.target.value)}
                className="mt-1.5 w-full rounded-[10px] border border-line/60 bg-ink-2/50 px-3 py-2.5 text-[13px] text-snow outline-none focus:ring-2 focus:ring-volt/40"
              >
                <option>Shopee</option>
                <option>Mercado Livre</option>
                <option>Instagram</option>
                <option>WhatsApp</option>
              </select>
            </div>
            <button
              onClick={gerar}
              disabled={gerando}
              className="w-full rounded-[10px] bg-volt py-2.5 text-[13px] font-semibold text-ink ring-1 ring-volt/40 disabled:opacity-60"
            >
              {gerando ? "Gerando…" : "Gerar conteúdo"}
            </button>
            {erro && <p className="rounded-[10px] bg-destructive/15 px-3 py-2 text-[12px] text-snow">{erro}</p>}
            {aviso && <p className="rounded-[10px] bg-volt/12 px-3 py-2 text-[12px] text-volt">{aviso}</p>}
          </div>
        </Painel>

        <Painel className="xl:col-span-2">
          <h2 className="font-display text-base font-semibold text-snow">Conteúdo gerado</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-fog">Título</label>
                <textarea
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  rows={2}
                  placeholder="O título aparece aqui"
                  className="mt-1.5 w-full rounded-[10px] border border-line/60 bg-ink-2/50 px-3 py-2.5 text-[13px] leading-snug text-snow outline-none placeholder:text-fog/50"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-fog">Descrição</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={7}
                  placeholder="A descrição aparece aqui"
                  className="mt-1.5 w-full rounded-[10px] border border-line/60 bg-ink-2/50 px-3 py-2.5 text-[12px] leading-relaxed text-mist outline-none placeholder:text-fog/50"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-fog">Palavras-chave</label>
                <p className="mt-1.5 rounded-[10px] border border-line/60 bg-ink-2/50 px-3 py-2.5 text-[12px] text-mist">
                  {palavras || "—"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-fog">Foto do produto</label>
              <img
                src={imagem ?? produtoDemo}
                alt={titulo || "Foto do produto"}
                loading="lazy"
                width={1024}
                height={1024}
                className="aspect-square w-full rounded-[12px] border border-line/50 object-cover"
              />
              <button
                onClick={foto}
                disabled={gerandoFoto}
                className="w-full rounded-[10px] border border-line/70 py-2.5 text-[13px] font-medium text-mist transition-colors hover:bg-snow/5 disabled:opacity-60"
              >
                {gerandoFoto ? "Criando foto…" : "Gerar foto com IA"}
              </button>
              <button
                onClick={salvar}
                disabled={!titulo}
                className="w-full rounded-[10px] bg-volt py-2.5 text-[13px] font-semibold text-ink ring-1 ring-volt/40 disabled:opacity-60"
              >
                Salvar produto
              </button>
            </div>
          </div>
        </Painel>
      </div>

      <Painel className="mt-4">
        <h2 className="font-display text-base font-semibold text-snow">Produtos salvos</h2>
        {salvos.length === 0 ? (
          <p className="mt-3 text-[13px] text-fog">Nenhum produto salvo ainda.</p>
        ) : (
          <div className="mt-3 divide-y divide-line/50">
            {salvos.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-[13px] text-snow">{p.nome}</p>
                  <p className="truncate text-[12px] text-fog">{p.titulo ?? "sem título"}</p>
                </div>
                <p className="shrink-0 text-[11px] text-fog">
                  {new Date(p.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </Painel>
    </AppShell>
  );
}
