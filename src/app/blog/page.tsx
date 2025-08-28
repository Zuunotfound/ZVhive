"use client";
import { useEffect, useState } from 'react';
import AuthGate from '@/components/AuthGate';
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase/client';
import Link from 'next/link';

export default function BlogPage() {
	return (
		<AuthGate>
			<BlogList />
		</AuthGate>
	);
}

function BlogList() {
	const [posts, setPosts] = useState<any[]>([]);
	const [title, setTitle] = useState('');
	async function refresh() {
		const q = query(collection(firestoreDb, 'posts'), orderBy('createdAt', 'desc'), limit(50));
		const snap = await getDocs(q);
		setPosts(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
	}
	useEffect(() => { refresh(); }, []);
	async function create() {
		await addDoc(collection(firestoreDb, 'posts'), { title, body: '', createdAt: serverTimestamp() });
		setTitle('');
		await refresh();
	}
	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Blog</h2>
			<div className="flex gap-2">
				<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul" className="rounded-md bg-white/10 border border-white/10 px-3 py-2" />
				<button onClick={create} disabled={!title} className="px-3 py-2 rounded-md bg-brand-500 hover:bg-brand-400">Buat</button>
			</div>
			<div className="rounded-lg border border-white/10 divide-y divide-white/10">
				{posts.map(p => (
					<Link key={p.id} href={`/blog/${p.id}`} className="block p-3 hover:bg-white/5">
						<div className="font-medium">{p.title}</div>
						<div className="text-white/50 text-sm">{p.id}</div>
					</Link>
				))}
			</div>
		</div>
	);
}