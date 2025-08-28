export default function PlansPage() {
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
        </div>
        <div className="border border-white/10 rounded p-4">
          <h3 className="font-semibold">Enterprise</h3>
          <p className="text-sm text-muted">Kustom sesuai kebutuhan</p>
        </div>
      </div>
    </div>
  );
}

