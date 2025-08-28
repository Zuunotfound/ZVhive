import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">ZVHive</h1>
        <p className="text-muted">Baca & nonton komik/anime/manhwa/manhua/donghua. Komunitas, blog, chat, dan API tersedia.</p>
        <div className="flex items-center justify-center gap-3">
          <Link className="px-4 py-2 rounded bg-foreground text-background" href="/reader">Mulai Baca</Link>
          <Link className="px-4 py-2 rounded border border-white/10" href="/plans">Lihat Paket</Link>
        </div>
      </section>
    </div>
  );
}
