"use client";
import { useAccount } from "../../hooks/useAccount";
import { useState } from "react";
import { apiFetch } from "../../lib/api";

export default function AdminPage() {
  const { account } = useAccount();
  const isAdmin = account?.role === "admin";
  const [targetUid, setTargetUid] = useState("");
  if (!isAdmin) return <p className="text-muted">Akses admin diperlukan.</p>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <div className="space-y-2">
        <input className="bg-muted rounded px-3 py-2" placeholder="Target UID" value={targetUid} onChange={(e) => setTargetUid(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 rounded border border-white/10" onClick={async () => { await apiFetch(`/api/admin/user/${targetUid}/verify`, { method: 'POST' }); alert('Verified'); }}>Verify</button>
          <button className="px-3 py-1 rounded border border-white/10" onClick={async () => { await apiFetch(`/api/admin/user/${targetUid}/ban`, { method: 'POST' }); alert('Banned'); }}>Ban</button>
          <button className="px-3 py-1 rounded border border-white/10" onClick={async () => { await apiFetch(`/api/admin/user/${targetUid}/unban`, { method: 'POST' }); alert('Unbanned'); }}>Unban</button>
          <button className="px-3 py-1 rounded border border-red-400 text-red-400" onClick={async () => { await apiFetch(`/api/admin/user/${targetUid}/delete`, { method: 'POST' }); alert('Deleted'); }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

