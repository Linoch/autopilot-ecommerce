import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth, iniciais } from "@/hooks/useAuth";

const grupos: Array<{ titulo: string; itens: Array<{ to: string; rotulo: string }> }> = [
  {
    titulo: "Operação",
    itens: [
      { to: "/", rotulo: "Visão geral" },
      { to: "/canais", rotulo: "Canais" },
      { to: "/pedidos", rotulo: "Pedidos" },
      { to: "/estoque", rotulo: "Estoque" },
    ],
  },
  {
    titulo: "Inteligência",
    itens: [
      { to: "/conteudo", rotulo: "Gerador de conteúdo" },
      { to: "/chatbot", rotulo: "Chatbot 24h" },
    ],
  },
  {
    titulo: "Conta",
    itens: [{ to: "/planos", rotulo: "Planos e assinatura" }],
  },
];

function Fundo() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div className="drift-a absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-volt/20 blur-[120px]" />
      <div className="drift-b absolute right-[-8%] top-[30%] h-[460px] w-[460px] rounded-full bg-ig/15 blur-[130px]" />
      <div className="drift-a absolute bottom-[-15%] left-[35%] h-[420px] w-[420px] rounded-full bg-ml/10 blur-[120px]" />
    </div>
  );
}

export function AppShell({
  titulo,
  subtitulo,
  acao,
  children,
}: {
  titulo: string;
  subtitulo: string;
  acao?: ReactNode;
  children: ReactNode;
}) {
  const { user, carregando, sair } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!carregando && !user) navigate({ to: "/entrar" });
  }, [carregando, user, navigate]);

  if (carregando || !user) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-ink text-fog">
        <Fundo />
        <p className="relative z-10 text-sm">Carregando sua operação…</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ink text-snow">
      <Fundo />
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-line/70 bg-ink-2/70 backdrop-blur-xl lg:flex">
          <div className="flex items-center gap-2.5 px-5 py-5">
            <div className="grid size-9 place-items-center rounded-[10px] bg-volt font-display text-lg font-bold text-ink">O</div>
            <div className="leading-tight">
              <p className="font-display text-[15px] font-semibold tracking-tight">Orbita</p>
              <p className="text-[11px] text-fog">Operação de vendas</p>
            </div>
          </div>

          <nav className="mt-2 flex-1 space-y-1 px-3">
            {grupos.map((grupo) => (
              <div key={grupo.titulo}>
                <p className="px-3 pb-1 pt-4 text-[10px] font-medium uppercase tracking-[0.18em] text-fog/70">
                  {grupo.titulo}
                </p>
                {grupo.itens.map((item) => {
                  const ativo = pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={
                        ativo
                          ? "flex items-center gap-3 rounded-[10px] bg-volt/15 px-3 py-2.5 text-sm font-medium text-snow ring-1 ring-volt/25"
                          : "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-fog transition-colors hover:bg-snow/5 hover:text-snow"
                      }
                    >
                      <span className={ativo ? "size-1.5 rounded-full bg-volt" : "size-1.5 rounded-full bg-fog/40"} />
                      {item.rotulo}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="m-3 rounded-[14px] border border-line/70 bg-ink-3/60 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-mist">Plano Crescer</p>
              <span className="rounded-full bg-volt/15 px-2 py-0.5 text-[10px] font-semibold text-volt">Ativo</span>
            </div>
            <p className="mt-2 text-[11px] text-fog">Renova em 12 dias</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-snow/10">
              <div className="h-full w-3/4 rounded-full bg-volt" />
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-line/60 bg-ink/70 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-[9px] bg-volt font-display font-bold text-ink lg:hidden">O</div>
                <div>
                  <h1 className="font-display text-lg font-semibold tracking-tight text-snow">{titulo}</h1>
                  <p className="text-[12px] text-fog">{subtitulo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {acao}
                <button
                  onClick={() => sair()}
                  className="rounded-[10px] border border-line/70 px-3 py-2 text-[13px] font-medium text-mist transition-colors hover:bg-snow/5"
                >
                  Sair
                </button>
                <div className="grid size-9 place-items-center rounded-[10px] bg-ink-3 font-display text-sm font-semibold text-mist ring-1 ring-line">
                  {iniciais(user.email)}
                </div>
              </div>
            </div>
            <nav className="flex gap-1 overflow-x-auto border-t border-line/50 px-5 py-2 lg:hidden">
              {grupos.flatMap((g) => g.itens).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    pathname === item.to
                      ? "whitespace-nowrap rounded-full bg-volt/15 px-3 py-1.5 text-[12px] font-medium text-snow"
                      : "whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium text-fog"
                  }
                >
                  {item.rotulo}
                </Link>
              ))}
            </nav>
          </header>

          <div className="px-5 py-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function Painel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`panel-glass rounded-[18px] p-5 ${className}`}>{children}</section>
  );
}
