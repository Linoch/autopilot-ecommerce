import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Orbita, operação de e-commerce" },
      {
        name: "description",
        content: "Acesse o painel Orbita para automatizar vendas, conteúdo e atendimento da sua loja.",
      },
      { property: "og:title", content: "Entrar — Orbita" },
      { property: "og:description", content: "Acesse o painel de automação da sua loja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const navigate = useNavigate();
  const { user, carregando } = useAuth();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loja, setLoja] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!carregando && user) navigate({ to: "/" });
  }, [carregando, user, navigate]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setEnviando(true);
    try {
      if (modo === "criar") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            emailRedirectTo: window.location.origin,
            data: { loja },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setAviso("Enviamos um e-mail de confirmação. Confirme para entrar.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Não consegui concluir agora.";
      setErro(
        msg.includes("Invalid login")
          ? "E-mail ou senha incorretos."
          : msg.includes("already registered")
            ? "Esse e-mail já tem conta. Use entrar."
            : msg,
      );
    } finally {
      setEnviando(false);
    }
  }

  async function entrarComGoogle() {
    setErro(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setErro("Não consegui entrar com o Google agora.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 text-snow">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="drift-a absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-volt/20 blur-[120px]" />
        <div className="drift-b absolute right-[-8%] top-[25%] h-[460px] w-[460px] rounded-full bg-ig/15 blur-[130px]" />
      </div>

      <div className="panel-glass relative z-10 w-full max-w-md rounded-[18px] p-7">
        <div className="flex items-center gap-2.5">
          <div className="grid size-10 place-items-center rounded-[10px] bg-volt font-display text-lg font-bold text-ink">O</div>
          <div className="leading-tight">
            <p className="font-display text-base font-semibold">Orbita</p>
            <p className="text-[12px] text-fog">Operação de vendas automatizada</p>
          </div>
        </div>

        <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight">
          {modo === "entrar" ? "Entrar na sua loja" : "Criar sua conta"}
        </h1>
        <p className="mt-1 text-[13px] text-fog">
          Canais, conteúdo com IA e atendimento 24h em um só painel.
        </p>

        <form onSubmit={enviar} className="mt-6 space-y-3">
          {modo === "criar" && (
            <div>
              <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-fog">Nome da loja</label>
              <input
                value={loja}
                onChange={(e) => setLoja(e.target.value)}
                placeholder="Minha Loja"
                className="mt-1.5 w-full rounded-[10px] border border-line/60 bg-ink-2/60 px-3 py-2.5 text-[14px] text-snow outline-none placeholder:text-fog/50 focus:ring-2 focus:ring-volt/40"
              />
            </div>
          )}
          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-fog">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@sualoja.com.br"
              className="mt-1.5 w-full rounded-[10px] border border-line/60 bg-ink-2/60 px-3 py-2.5 text-[14px] text-snow outline-none placeholder:text-fog/50 focus:ring-2 focus:ring-volt/40"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-fog">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="mínimo 6 caracteres"
              className="mt-1.5 w-full rounded-[10px] border border-line/60 bg-ink-2/60 px-3 py-2.5 text-[14px] text-snow outline-none placeholder:text-fog/50 focus:ring-2 focus:ring-volt/40"
            />
          </div>

          {erro && <p className="rounded-[10px] bg-destructive/15 px-3 py-2 text-[12px] text-destructive-foreground">{erro}</p>}
          {aviso && <p className="rounded-[10px] bg-volt/12 px-3 py-2 text-[12px] text-volt">{aviso}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-[10px] bg-volt py-2.5 text-[13px] font-semibold text-ink ring-1 ring-volt/40 disabled:opacity-60"
          >
            {enviando ? "Aguarde…" : modo === "entrar" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-[11px] text-fog/70">
          <span className="h-px flex-1 bg-line/60" /> ou <span className="h-px flex-1 bg-line/60" />
        </div>

        <button
          onClick={entrarComGoogle}
          className="w-full rounded-[10px] border border-line/70 bg-ink-2/60 py-2.5 text-[13px] font-medium text-mist transition-colors hover:bg-snow/5"
        >
          Continuar com Google
        </button>

        <p className="mt-5 text-center text-[12px] text-fog">
          {modo === "entrar" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={() => {
              setModo(modo === "entrar" ? "criar" : "entrar");
              setErro(null);
              setAviso(null);
            }}
            className="font-semibold text-volt"
          >
            {modo === "entrar" ? "Criar agora" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
