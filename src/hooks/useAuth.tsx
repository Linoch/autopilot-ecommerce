import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, novaSessao) => {
      setSession(novaSessao);
      setCarregando(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCarregando(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const user: User | null = session?.user ?? null;

  return { session, user, carregando, sair: () => supabase.auth.signOut() };
}

export function iniciais(nome?: string | null) {
  if (!nome) return "LJ";
  const partes = nome.trim().split(/[\s@.]+/).filter(Boolean);
  return (partes[0]?.[0] ?? "L").concat(partes[1]?.[0] ?? "").toUpperCase();
}
