"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase/client';

export default function BlogDetailPage() {
	return (
		<AuthGate>
			<Editor />
		</AuthGate>
	);
}

function Editor() {
	const params = useParams<{ id: string }>();
	const postId = params?.id as string;
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [saving, setSaving] = useState(false);
	useEffect(() => {
		if (!postId) return;
		const ref = doc(firestoreDb, 'posts', postId);
		getDoc(ref).then((snap) => {
			if (snap.exists()) {
				const d = snap.data() as any;
				setTitle(d.title ?? '');
				setBody(d.body ?? '');
			}
		});
	}, [postId]);
	async function save() {
		setSaving(true);
		const ref = doc(firestoreDb, 'posts', postId);
		await setDoc(ref, { title, body }, { merge: true });
		setSaving(false);
	}
	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold">Edit Blog</h2>
			<input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2" />
			<textarea value={body} onChange={(e) => setBody(e.target.value)} rows={12} className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2" />
			<button onClick={save} disabled={saving} className="px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-400">{saving ? 'Menyimpan...' : 'Simpan'}</button>
		</div>
	);
}