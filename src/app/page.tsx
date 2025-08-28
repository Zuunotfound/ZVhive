export default function HomePage() {
  return (
    <section className="py-16">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Read, watch, and connect on <span className="text-brand-400">ZVHive</span>
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Komik, anime, manhwa, manhua, donghua, dan komunitas dalam satu tempat.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a className="px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-400 transition" href="/reader">Mulai Baca</a>
          <a className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition" href="/watch">Mulai Nonton</a>
          <a className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition" href="/community">Gabung Komunitas</a>
        </div>
      </div>
    </section>
  );
}