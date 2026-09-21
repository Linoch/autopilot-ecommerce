import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Painel } from "@/components/AppShell";
import { brl, canais, conversasDemo } from "@/lib/demo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão geral — Orbita" },
      {
        name: "description",
        content: "Vendas, pedidos e atendimento de todos os seus canais em um só painel.",
      },
      { property: "og:title", content: "Visão geral — Orbita" },
      { property: "og:description", content: "Vendas, pedidos e atendimento de todos os seus canais." },
    ],
  }),
  component: VisaoGeral,
});

const hoje = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function Kpi({ rotulo, valor, nota, tom }: { rotulo: string; valor: string; nota: string; tom: string }) {
  return (
    <div className="panel-glass rounded-[16px] p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-fog">{rotulo}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-snow">{valor}</p>
      <p className={`mt-1 text-[12px] font-medium ${tom}`}>{nota}</p>
    </div>
  );
}

function VisaoGeral() {
  const totalVendas = canais.reduce((s, c) => s + c.vendas, 0);
  const totalPedidos = canais.reduce((s, c) => s + c.pedidos, 0);

  return (
    <AppShell
      titulo="Visão geral"
      subtitulo={`${hoje} · loja em operação`}
      acao={
        <Link
          to="/conteudo"
          className="rounded-[10px] bg-volt px-3.5 py-2 text-[13px] font-semibold text-ink ring-1 ring-volt/40"
        >
          Novo produto
        </Link>
      }
    >
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi rotulo="Vendas hoje" valor={brl(totalVendas)} nota="+12,4% vs. ontem" tom="text-volt" />
        <Kpi rotulo="Pedidos abertos" valor={String(totalPedidos)} nota="18 aguardando envio" tom="text-amber" />
        <Kpi rotulo="Conversão" valor="3,8%" nota="média de 30 dias" tom="text-fog" />
        <Kpi rotulo="Chatbot 24h" valor="92%" nota="resolvidos sem humano" tom="text-volt" />
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Painel className="xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold tracking-tight text-snow">Canais conectados</h2>
              <p className="text-[12px] text-fog">Vendas e pedidos por canal nos últimos 7 dias</p>
            </div>
            <span className="rounded-full bg-snow/5 px-2.5 py-1 text-[11px] font-medium text-mist ring-1 ring-line">7 dias</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {canais.map((canal) => (
              <div key={canal.id} className="flex items-center gap-3 rounded-[12px] border border-line/50 bg-ink-2/40 p-3">
                <div className={`grid size-10 shrink-0 place-items-center rounded-[10px] bg-${canal.cor}/15 font-display text-sm font-bold text-${canal.cor}`}>
                  {canal.sigla}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-snow">{canal.nome}</p>
                    <p className="font-display text-sm font-semibold text-snow">{brl(canal.vendas)}</p>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-snow/10">
                    <div className={`h-full rounded-full bg-${canal.cor}`} style={{ width: `${canal.participacao}%` }} />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <p className="text-[11px] text-fog">Pedidos</p>
                  <p className="font-display text-sm font-semibold text-snow">{canal.pedidos}</p>
                </div>
                <span
                  className={
                    canal.status === "online"
                      ? "rounded-full bg-volt/15 px-2 py-0.5 text-[10px] font-semibold text-volt"
                      : "rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-semibold text-amber"
                  }
                >
                  {canal.status}
                </span>
              </div>
            ))}
          </div>
        </Painel>

        <Painel>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold tracking-tight text-snow">Gerador de conteúdo</h2>
            <span className="rounded-full bg-volt/15 px-2.5 py-1 text-[11px] font-semibold text-volt">IA</span>
          </div>
          <p className="mt-1 text-[12px] text-fog">Título, descrição e foto prontos em segundos</p>
          <ul className="mt-4 space-y-2 text-[13px] text-mist">
            <li className="rounded-[10px] border border-line/60 bg-ink-2/50 px-3 py-2.5">Títulos otimizados por canal</li>
            <li className="rounded-[10px] border border-line/60 bg-ink-2/50 px-3 py-2.5">Descrições completas em segundos</li>
            <li className="rounded-[10px] border border-line/60 bg-ink-2/50 px-3 py-2.5">Fotos de estúdio geradas por IA</li>
          </ul>
          <Link
            to="/conteudo"
            className="mt-4 block w-full rounded-[10px] bg-volt py-2.5 text-center text-[13px] font-semibold text-ink ring-1 ring-volt/40"
          >
            Gerar conteúdo
          </Link>
        </Painel>
      </section>

      <Painel className="mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight text-snow">Inbox do chatbot</h2>
            <p className="text-[12px] text-fog">Atendimento 24h · 3 conversas recentes</p>
          </div>
          <Link to="/chatbot" className="rounded-full bg-ig/15 px-2.5 py-1 text-[11px] font-semibold text-ig">
            abrir chatbot
          </Link>
        </div>

        <div className="mt-4 divide-y divide-line/50">
          {conversasDemo.map((c) => (
            <div key={c.cliente} className="flex items-center gap-3 py-3">
              <div className={`grid size-9 shrink-0 place-items-center rounded-full bg-${c.canal === "instagram" ? "ig" : c.canal === "whatsapp" ? "wa" : "shopee"}/15 font-display text-xs font-semibold text-${c.canal === "instagram" ? "ig" : c.canal === "whatsapp" ? "wa" : "shopee"}`}>
                {c.cliente.split(" ").map((p) => p[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-snow">{c.cliente}</p>
                  <p className="text-[11px] text-fog">{c.tempo}</p>
                </div>
                <p className="truncate text-[12px] text-fog">“{c.texto}”</p>
              </div>
              <span
                className={
                  c.status === "resolvido"
                    ? "rounded-full bg-volt/15 px-2 py-0.5 text-[10px] font-semibold text-volt"
                    : "rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-semibold text-amber"
                }
              >
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </Painel>
    </AppShell>
  );
}
