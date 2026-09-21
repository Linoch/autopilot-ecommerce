import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Painel } from "@/components/AppShell";
import { estoque } from "@/lib/demo";

export const Route = createFileRoute("/estoque")({
  head: () => ({
    meta: [
      { title: "Estoque — Orbita" },
      { name: "description", content: "Estoque sincronizado entre todos os canais de venda da sua loja." },
      { property: "og:title", content: "Estoque — Orbita" },
      { property: "og:description", content: "Estoque sincronizado entre todos os seus canais." },
    ],
  }),
  component: Estoque,
});

function Estoque() {
  const baixos = estoque.filter((i) => i.quantidade < i.minimo);

  return (
    <AppShell titulo="Estoque" subtitulo="Sincronizado automaticamente entre os canais">
      {baixos.length > 0 && (
        <p className="mb-4 rounded-[12px] border border-amber/30 bg-amber/10 px-4 py-3 text-[12px] text-amber">
          {baixos.length} produtos abaixo do estoque mínimo: {baixos.map((b) => b.produto).join(", ")}.
        </p>
      )}

      <Painel>
        <div className="divide-y divide-line/50">
          {estoque.map((item) => {
            const critico = item.quantidade < item.minimo;
            return (
              <div key={item.sku} className="flex flex-wrap items-center gap-3 py-3">
                <p className="w-20 font-display text-[12px] font-semibold text-fog">{item.sku}</p>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-snow">{item.produto}</p>
                  <p className="text-[11px] text-fog">em {item.canais} canais · mínimo {item.minimo}</p>
                </div>
                <div className="w-32">
                  <div className="h-1.5 overflow-hidden rounded-full bg-snow/10">
                    <div
                      className={critico ? "h-full rounded-full bg-amber" : "h-full rounded-full bg-volt"}
                      style={{ width: `${Math.min(100, (item.quantidade / (item.minimo * 3)) * 100)}%` }}
                    />
                  </div>
                </div>
                <p className={`w-14 text-right font-display text-sm font-semibold ${critico ? "text-amber" : "text-snow"}`}>
                  {item.quantidade}
                </p>
              </div>
            );
          })}
        </div>
      </Painel>
    </AppShell>
  );
}
