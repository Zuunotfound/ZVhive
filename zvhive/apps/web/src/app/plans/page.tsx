"use client";
import { useAuth } from "../../providers/AuthProvider";
import { apiFetch } from "../../lib/api";
import { useState } from "react";

export default function PlansPage() {
  const { idToken } = useAuth();
  const [loading, setLoading] = useState(false);

  async function upgrade(plan: 'pro' | 'enterprise') {
    if (!idToken) return;
    setLoading(true);
    try {
      await apiFetch("/api/plans/upgrade", { method: "POST", body: { plan, durationMonths: 1 }, idToken });
      alert("Plan upgraded: " + plan);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Paket</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="border border-white/10 rounded p-4">
          <h3 className="font-semibold">Free</h3>
          <p className="text-sm text-muted">API 1500/bulan, Bug 1/hari</p>
        </div>
        <div className="border border-white/10 rounded p-4">
          <h3 className="font-semibold">Pro</h3>
          <p className="text-sm text-muted">Limit lebih tinggi, tanpa iklan</p>
          <button className="mt-2 px-3 py-1 rounded bg-foreground text-background" onClick={() => upgrade('pro')} disabled={loading || !idToken}>Upgrade</button>
        </div>
        <div className="border border-white/10 rounded p-4">
          <h3 className="font-semibold">Enterprise</h3>
          <p className="text-sm text-muted">Kustom sesuai kebutuhan</p>
          <button className="mt-2 px-3 py-1 rounded bg-foreground text-background" onClick={() => upgrade('enterprise')} disabled={loading || !idToken}>Hubungi</button>
        </div>
      </div>
    </div>
  );
}

