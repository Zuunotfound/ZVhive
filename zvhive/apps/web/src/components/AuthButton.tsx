"use client";
import { useAuth } from "../providers/AuthProvider";

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOutNow } = useAuth();
  if (loading) return <button className="text-xs opacity-60">Loading…</button>;
  return user ? (
    <button onClick={signOutNow} className="text-sm px-3 py-1 rounded border border-black/10 dark:border-white/10">
      Sign out
    </button>
  ) : (
    <button onClick={signInWithGoogle} className="text-sm px-3 py-1 rounded bg-foreground text-background">
      Sign in
    </button>
  );
}

