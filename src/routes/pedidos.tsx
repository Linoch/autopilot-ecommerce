import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Painel } from "@/components/AppShell";
import { brl, pedidos } from "@/lib/demo";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Pedidos — Orbita" },
      { name: "description", content: "Todos os pedidos dos seus canais reunidos em uma lista só." },
      { property: "og:title", content: "Pedidos — Orbita" },
      { property: "og:description", content: "Acompanhe pedidos de todos os canais em um só lugar." },
    ],
  }),
  component: Pedidos,
});

const filtros = ["Todos", "Shopee", "Mercado Livre", "Instagram", "WhatsApp"];

function Pedidos() {
  const [filtro, setFiltro] = useState("Todos");
  const lista = filtro === "Todos" ? pedidos : pedidos.filter((p) => p.canal === filtro);

  return (
    <AppShell titulo="Pedidos" subtitulo={`${pedidos.length} pedidos recentes em todos os canais`}>
      <Painel>
        <div className="flex flex-wrap gap-2">
          {filtros.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={
                filtro === f
                  ? "rounded-full bg-volt/15 px-3 py-1.5 text-[12px] font-semibold text-volt ring-1 ring-volt/25"
                  : "rounded-full px-3 py-1.5 text-[12px] font-medium text-fog hover:bg-snow/5"
              }
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-4 divide-y divide-line/50">
          {lista.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-3 py-3">
              <p className="w-20 font-display text-[13px] font-semibold text-snow">{p.id}</p>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-snow">{p.cliente}</p>
                <p className="text-[11px] text-fog">
                  {p.canal} · {p.data}
                </p>
              </div>
              <p className="font-display text-[13px] font-semibold text-snow">{brl(p.valor)}</p>
              <span
                className={
                  p.status === "Aguardando envio"
                    ? "rounded-full bg-amber/15 px-2.5 py-0.5 text-[10px] font-semibold text-amber"
                    : p.status === "Entregue"
                      ? "rounded-full bg-volt/15 px-2.5 py-0.5 text-[10px] font-semibold text-volt"
                      : "rounded-full bg-snow/5 px-2.5 py-0.5 text-[10px] font-semibold text-mist"
                }
              >
                {p.status}
              </span>
            </div>
          ))}
          {lista.length === 0 && <p className="py-6 text-center text-[13px] text-fog">Nenhum pedido nesse canal.</p>}
        </div>
      </Painel>
    </AppShell>
  );
}
