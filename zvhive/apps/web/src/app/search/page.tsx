"use client";
import { useState } from "react";
import { apiFetch } from "../../lib/api";

type Series = { id: string; title: string; kind?: string };
type CommunityPost = { id: string; title: string; content: string };
type BlogPost = { id: string; title: string; content: string };
type Result = { series: Series[]; posts: CommunityPost[]; blog: BlogPost[] };

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<Result | null>(null);
  async function run() {
    const r = await apiFetch<Result>(`/api/search?q=${encodeURIComponent(q)}`);
    setData(r);
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Search</h1>
      <div className="flex gap-2">
        <input className="flex-1 bg-muted rounded px-3 py-2" placeholder="Cari..." value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="px-3 py-2 rounded bg-foreground text-background" onClick={run} disabled={q.length < 2}>Cari</button>
      </div>
      {data && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <h2 className="font-semibold mb-2">Series</h2>
            <ul className="space-y-1 text-sm text-muted">{data.series.map((s) => <li key={s.id}>{s.title}</li>)}</ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Community</h2>
            <ul className="space-y-1 text-sm text-muted">{data.posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Blog</h2>
            <ul className="space-y-1 text-sm text-muted">{data.blog.map((b) => <li key={b.id}>{b.title}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
}

