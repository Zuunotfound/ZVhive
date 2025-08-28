import AdSlot from '@/components/AdSlot';

export default function WatchPage() {
  return (
    <div className="space-y-4">
      <AdSlot label="Ad - Top" height={100} />
      <div className="rounded-lg bg-white/5 p-6 min-h-[60vh]">Konten Video (Episode)</div>
      <AdSlot label="Ad - Bottom" height={100} />
    </div>
  );
}