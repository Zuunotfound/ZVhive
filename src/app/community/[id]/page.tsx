"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase/client';

export default function ThreadDetailPage() {
	return (
		<AuthGate>
			<ThreadDetail />
		</AuthGate>
	);
}

function ThreadDetail() {
	const params = useParams<{ id: string }>();
	const threadId = params?.id as string;
	const [thread, setThread] = useState<any | null>(null);
	const [replies, setReplies] = useState<any[]>([]);
	const [text, setText] = useState('');
	async function refresh() {
		const docRef = doc(firestoreDb, 'threads', threadId);
		const base = await getDoc(docRef);
		setThread(base.exists() ? { id: base.id, ...(base.data() as any) } : null);
		const q = query(collection(docRef, 'replies'), orderBy('createdAt', 'asc'));
		const snap = await getDocs(q);
		setReplies(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
	}
	useEffect(() => { if (threadId) refresh(); }, [threadId]);
	async function send() {
		const docRef = doc(firestoreDb, 'threads', threadId);
		await addDoc(collection(docRef, 'replies'), { text, createdAt: serverTimestamp() });
		setText('');
		await refresh();
	}
	if (!thread) return null;
	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold">{thread.title}</h2>
			<div className="rounded-lg border border-white/10 divide-y divide-white/10">
				{replies.map(r => (
					<div key={r.id} className="p-3 text-sm">{r.text}</div>
				))}
			</div>
			<div className="flex gap-2">
				<input value={text} onChange={(e) => setText(e.target.value)} placeholder="Balas..." className="rounded-md bg-white/10 border border-white/10 px-3 py-2 flex-1" />
				<button onClick={send} disabled={!text} className="px-3 py-2 rounded-md bg-brand-500 hover:bg-brand-400">Kirim</button>
			</div>
		</div>
	);
}