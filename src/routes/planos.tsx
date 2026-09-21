import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Painel } from "@/components/AppShell";
import { planos } from "@/lib/demo";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos e assinatura — Orbita" },
      { name: "description", content: "Assinatura mensal do Orbita: Essencial, Crescer e Escala." },
      { property: "og:title", content: "Planos e assinatura — Orbita" },
      { property: "og:description", content: "Escolha o plano mensal ideal para a sua loja." },
    ],
  }),
  component: Planos,
});

function Planos() {
  const [atual, setAtual] = useState("crescer");

  return (
    <AppShell titulo="Planos e assinatura" subtitulo="Faturamento mensal · cancele quando quiser">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {planos.map((plano) => {
          const ativo = plano.id === atual;
          return (
            <Painel key={plano.id} className={ativo ? "ring-1 ring-volt/30" : ""}>
              <div className="flex items-center justify-between">
                <p className={`text-[12px] font-medium ${ativo ? "text-volt" : "text-fog"}`}>{plano.nome}</p>
                {ativo && (
                  <span className="rounded-full bg-volt/20 px-2 py-0.5 text-[10px] font-semibold text-volt">Atual</span>
                )}
              </div>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-snow">
                R$ {plano.preco}
                <span className="text-sm font-medium text-fog">/mês</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-[12px] text-mist">
                {plano.itens.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <button
                onClick={() => setAtual(plano.id)}
                disabled={ativo}
                className={
                  ativo
                    ? "mt-4 w-full rounded-[10px] border border-line/70 py-2.5 text-[13px] font-medium text-fog"
                    : "mt-4 w-full rounded-[10px] bg-volt py-2.5 text-[13px] font-semibold text-ink ring-1 ring-volt/40"
                }
              >
                {ativo ? "Plano ativo" : "Mudar para este plano"}
              </button>
            </Painel>
          );
        })}
      </div>

      <Painel className="mt-4">
        <h2 className="font-display text-base font-semibold text-snow">Pagamento</h2>
        <p className="mt-1 text-[12px] text-fog">
          A cobrança automática ainda não está ligada. Quando você escolher o meio de pagamento, ativamos a cobrança
          recorrente dos assinantes.
        </p>
      </Painel>
    </AppShell>
  );
}
