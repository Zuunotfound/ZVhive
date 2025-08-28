"use client";
import { useAccount } from "../../hooks/useAccount";

export default function AdminPage() {
  const { account } = useAccount();
  const isAdmin = account?.role === "admin";
  if (!isAdmin) return <p className="text-muted">Akses admin diperlukan.</p>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-muted">Kelola verifikasi dan ban pengguna via API.</p>
    </div>
  );
}

