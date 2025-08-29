"use client";
import { AdSlot } from "../../components/AdSlot";
import { useAccount } from "../../hooks/useAccount";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

type Series = { id: string; title: string; kind: string };
type Chapter = { id: string; number: number; title?: string };

export default function ReaderPage() {
  const { account } = useAccount();
  const showAds = !account?.adsDisabled;
  const [series, setSeries] = useState<Series[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  useEffect(() => {
    apiFetch<Series[]>("/api/content/series").then(setSeries);
  }, []);
  useEffect(() => {
    if (!selected) return;
    apiFetch<Chapter[]>(`/api/content/series/${selected}/chapters`).then(setChapters);
  }, [selected]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reader</h1>
      {showAds && <AdSlot placement="chapter-top" />}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h2 className="font-semibold">Series</h2>
          <ul className="space-y-2">
            {series.map((s) => (
              <li key={s.id}>
                <button className={`px-3 py-2 rounded border ${selected === s.id ? 'border-foreground' : 'border-white/10'}`} onClick={() => setSelected(s.id)}>
                  {s.title} <span className="text-xs text-muted">({s.kind})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">Chapters</h2>
          <ul className="space-y-2">
            {chapters.map((c) => (
              <li key={c.id} className="px-3 py-2 rounded border border-white/10">
                Chapter {c.number} {c.title ? `- ${c.title}` : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showAds && <AdSlot placement="chapter-bottom" />}
    </div>
  );
}

