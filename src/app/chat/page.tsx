"use client";
import { useEffect, useMemo, useState } from 'react';
import AuthGate from '@/components/AuthGate';
import { useAuth } from '@/components/AuthProvider';
import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase/client';

export default function ChatPage() {
	return (
		<AuthGate>
			<Chat />
		</AuthGate>
	);
}

function Chat() {
	const { user } = useAuth();
	const [targetUid, setTargetUid] = useState('');
	const [messages, setMessages] = useState<any[]>([]);
	const [text, setText] = useState('');
	const conversationId = useMemo(() => {
		if (!user || !targetUid) return null;
		return [user.uid, targetUid].sort().join('_');
	}, [user, targetUid]);
	useEffect(() => {
		if (!conversationId) return;
		const ref = collection(firestoreDb, 'conversations', conversationId, 'messages');
		const q = query(ref, orderBy('createdAt', 'asc'), limit(200));
		const unsub = onSnapshot(q, (snap) => {
			setMessages(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
		});
		return () => unsub();
	}, [conversationId]);
	async function send() {
		if (!conversationId) return;
		const ref = collection(firestoreDb, 'conversations', conversationId, 'messages');
		await addDoc(ref, { from: user!.uid, text, createdAt: serverTimestamp() });
		setText('');
	}
	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold">Private Chat</h2>
			<input value={targetUid} onChange={(e) => setTargetUid(e.target.value)} placeholder="UID teman" className="rounded-md bg-white/10 border border-white/10 px-3 py-2" />
			<div className="rounded-lg border border-white/10 min-h-[300px] p-3 space-y-2">
				{messages.map(m => (
					<div key={m.id} className={`text-sm ${m.from === user?.uid ? 'text-brand-400' : 'text-white/80'}`}>{m.text}</div>
				))}
			</div>
			<div className="flex gap-2">
				<input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis pesan..." className="rounded-md bg-white/10 border border-white/10 px-3 py-2 flex-1" />
				<button onClick={send} disabled={!text || !targetUid} className="px-3 py-2 rounded-md bg-brand-500 hover:bg-brand-400">Kirim</button>
			</div>
		</div>
	);
}