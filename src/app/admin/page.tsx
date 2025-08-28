export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Admin Panel</h2>
      <ul className="list-disc ml-6 text-white/80">
        <li>Kelola users (add/del/block/verify)</li>
        <li>Kelola konten</li>
        <li>Kelola plans</li>
      </ul>
    </div>
  );
}