export default function AdSlot({ label = 'Ad', height = 120 }: { label?: string; height?: number }) {
	return (
		<div className="rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60"
			style={{ minHeight: height }}>
			{label}
		</div>
	);
}