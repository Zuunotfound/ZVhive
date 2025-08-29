"use client";
import { useEffect, useState } from "react";

export function UpdateModal({ version }: { version: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const key = `zvhive_update_${version}`;
    const seen = typeof window !== "undefined" && window.localStorage.getItem(key);
    if (!seen) setOpen(true);
  }, [version]);
  function dismiss() {
    const key = `zvhive_update_${version}`;
    if (typeof window !== "undefined") window.localStorage.setItem(key, "1");
    setOpen(false);
  }
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-background border border-white/10 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">Pembaruan ZVHive</h3>
        <p className="text-sm text-muted mb-4">Versi {version}. Performa ditingkatkan, tema elegan, dan rute awal siap.</p>
        <button className="px-3 py-1 rounded bg-foreground text-background" onClick={dismiss}>OK</button>
      </div>
    </div>
  );
}