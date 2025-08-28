"use client";
import { useEffect, useState } from 'react';

const APP_VERSION = '0.1.0';

export default function UpdateModal() {
	const [open, setOpen] = useState(false);
	useEffect(() => {
		const key = `zvhive_last_seen_${APP_VERSION}`;
		if (typeof window !== 'undefined') {
			const seen = window.localStorage.getItem(key);
			if (!seen) setOpen(true);
		}
	}, []);
	function close() {
		const key = `zvhive_last_seen_${APP_VERSION}`;
		window.localStorage.setItem(key, '1');
		setOpen(false);
	}
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
			<div className="w-full max-w-md rounded-lg bg-[#151822] p-6 shadow-xl border border-white/10">
				<h3 className="text-lg font-semibold mb-2">Pembaruan ZVHive v{APP_VERSION}</h3>
				<ul className="list-disc ml-5 text-white/80 text-sm space-y-1">
					<li>UI modern dengan tema elegan</li>
					<li>REST API dengan rate limit bulanan</li>
					<li>Bug report 1x per hari</li>
				</ul>
				<button onClick={close} className="mt-4 px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-400">Oke</button>
			</div>
		</div>
	);
}