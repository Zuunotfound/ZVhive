"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { apiFetch } from "../lib/api";

export type Account = {
  uid: string;
  email?: string;
  role?: "user" | "verified" | "admin";
  plan?: "free" | "pro" | "enterprise";
  adsDisabled?: boolean;
};

export function useAccount() {
  const { idToken } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function run() {
      if (!idToken) return;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<Account>("/api/account/me", { idToken });
        setAccount(data);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [idToken]);
  return { account, loading, error };
}

