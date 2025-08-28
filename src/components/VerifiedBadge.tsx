export default function VerifiedBadge() {
	return (
		<span title="Verified" className="inline-flex items-center gap-1 text-brand-400 text-xs border border-brand-400/40 rounded px-1.5 py-0.5">
			<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
				<path d="M12 2l2.39 4.84L20 8.27l-3.64 3.55.86 5.01L12 15.9l-4.22 2.22.86-5.01L5 8.27l5.61-1.43L12 2z"/>
			</svg>
			Verified
		</span>
	);
}