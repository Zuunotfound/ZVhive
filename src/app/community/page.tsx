"use client";
import { useEffect, useState } from 'react';
import AuthGate from '@/components/AuthGate';
import { firestoreDb } from '@/lib/firebase/client';
import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function CommunityPage() {
	return (
		<AuthGate>
			<Threads />
		</AuthGate>
	);
}

function Threads() {
	const [threads, setThreads] = useState<any[]>([]);
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(false);
	async function refresh() {
		const q = query(collection(firestoreDb, 'threads'), orderBy('createdAt', 'desc'), limit(50));
		const snap = await getDocs(q);
		setThreads(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
	}
	useEffect(() => { refresh(); }, []);
	async function create() {
		setLoading(true);
		await addDoc(collection(firestoreDb, 'threads'), { title, createdAt: serverTimestamp() });
		setTitle('');
		await refresh();
		setLoading(false);
	}
	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Community</h2>
			<div className="flex gap-2">
				<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul thread" className="rounded-md bg-white/10 border border-white/10 px-3 py-2" />
				<button onClick={create} disabled={loading || !title} className="px-3 py-2 rounded-md bg-brand-500 hover:bg-brand-400">Buat</button>
			</div>
			<div className="rounded-lg border border-white/10 divide-y divide-white/10">
				{threads.map(t => (
					<Link key={t.id} href={`/community/${t.id}`} className="block p-3 hover:bg-white/5">
						<div className="font-medium">{t.title}</div>
						<div className="text-white/50 text-sm">{t.id}</div>
					</Link>
				))}
			</div>
		</div>
	);
}