import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Painel } from "@/components/AppShell";
import { brl, canais } from "@/lib/demo";

export const Route = createFileRoute("/canais")({
  head: () => ({
    meta: [
      { title: "Canais — Orbita" },
      {
        name: "description",
        content: "Shopee, Mercado Livre, Instagram e WhatsApp conectados e automatizados em um painel.",
      },
      { property: "og:title", content: "Canais — Orbita" },
      { property: "og:description", content: "Conecte e automatize seus canais de venda." },
    ],
  }),
  component: Canais,
});

function Canais() {
  const [conectados, setConectados] = useState<string[]>(canais.map((c) => c.id));

  return (
    <AppShell titulo="Canais" subtitulo="Conexões, automações e desempenho de cada canal">
      <p className="mb-4 rounded-[12px] border border-amber/30 bg-amber/10 px-4 py-3 text-[12px] text-amber">
        Demonstração: os canais estão simulados. Quando você tiver as contas em mãos, ligamos as conexões reais.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {canais.map((canal) => {
          const ligado = conectados.includes(canal.id);
          return (
            <Painel key={canal.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`grid size-11 place-items-center rounded-[12px] bg-${canal.cor}/15 font-display text-base font-bold text-${canal.cor}`}>
                    {canal.sigla}
                  </div>
                  <div>
                    <h2 className="font-display text-base font-semibold text-snow">{canal.nome}</h2>
                    <p className="text-[12px] text-fog">
                      {brl(canal.vendas)} · {canal.pedidos} pedidos nos últimos 7 dias
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setConectados((atual) =>
                      ligado ? atual.filter((c) => c !== canal.id) : [...atual, canal.id],
                    )
                  }
                  className={
                    ligado
                      ? "rounded-[10px] border border-line/70 px-3 py-1.5 text-[12px] font-medium text-mist hover:bg-snow/5"
                      : "rounded-[10px] bg-volt px-3 py-1.5 text-[12px] font-semibold text-ink"
                  }
                >
                  {ligado ? "Desconectar" : "Conectar"}
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {canal.automacoes.map((a) => (
                  <div
                    key={a}
                    className="flex items-center justify-between rounded-[10px] border border-line/50 bg-ink-2/40 px-3 py-2.5"
                  >
                    <span className="text-[13px] text-mist">{a}</span>
                    <span
                      className={
                        ligado
                          ? "rounded-full bg-volt/15 px-2 py-0.5 text-[10px] font-semibold text-volt"
                          : "rounded-full bg-snow/5 px-2 py-0.5 text-[10px] font-semibold text-fog"
                      }
                    >
                      {ligado ? "ativa" : "pausada"}
                    </span>
                  </div>
                ))}
              </div>
            </Painel>
          );
        })}
      </div>
    </AppShell>
  );
}
