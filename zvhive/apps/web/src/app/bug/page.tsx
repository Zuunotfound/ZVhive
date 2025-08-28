"use client";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { apiFetch } from "../../lib/api";

export default function BugReportPage() {
  const { idToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  async function submit() {
    if (!idToken || !title) return;
    try {
      const res = await apiFetch<{ ok: boolean; id: string }>("/api/bug-report", { method: "POST", body: { title, description }, idToken });
      setMsg(`Terkirim (#${res.id})`);
      setTitle("");
      setDescription("");
    } catch (e) {
      setMsg("Gagal / limit terpenuhi");
    }
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Lapor Bug</h1>
      <input className="w-full bg-muted rounded px-3 py-2" placeholder="Judul" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="w-full bg-muted rounded px-3 py-2" placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button className="px-3 py-1 rounded bg-foreground text-background" onClick={submit} disabled={!idToken}>Kirim</button>
      {msg && <div className="text-sm text-muted">{msg}</div>}
    </div>
  );
}

