"use client";
import { useEffect, useState } from 'react';
import AuthGate from '@/components/AuthGate';
import { useAuth } from '@/components/AuthProvider';
import { firestoreDb, firebaseStorage } from '@/lib/firebase/client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function ProfilePage() {
	return (
		<AuthGate>
			<Editor />
		</AuthGate>
	);
}

function Editor() {
	const { user } = useAuth();
	const [displayName, setDisplayName] = useState('');
	const [bio, setBio] = useState('');
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!user) return;
		const refDoc = doc(firestoreDb, 'profiles', user.uid);
		getDoc(refDoc).then((snap) => {
			if (snap.exists()) {
				const d = snap.data() as any;
				setDisplayName(d.displayName ?? '');
				setBio(d.bio ?? '');
				setAvatarUrl(d.avatarUrl ?? null);
			}
		});
	}, [user]);

	async function handleAvatarChange(file: File) {
		if (!user) return;
		const storageRef = ref(firebaseStorage, `avatars/${user.uid}`);
		await uploadBytes(storageRef, file);
		const url = await getDownloadURL(storageRef);
		setAvatarUrl(url);
	}

	async function save() {
		if (!user) return;
		setSaving(true);
		const refDoc = doc(firestoreDb, 'profiles', user.uid);
		await setDoc(refDoc, { displayName, bio, avatarUrl }, { merge: true });
		setSaving(false);
	}

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Profil</h2>
			<div className="flex items-start gap-6">
				<div>
					<div className="w-24 h-24 rounded-full bg-white/10 overflow-hidden">
						{avatarUrl ? (
							<img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
						) : (
							<div className="w-full h-full grid place-items-center text-white/50">No Photo</div>
						)}
					</div>
					<label className="mt-2 inline-block cursor-pointer text-sm text-brand-400 hover:underline">
						Ganti Foto
						<input type="file" className="hidden" accept="image/*" onChange={(e) => {
							const f = e.target.files?.[0];
							if (f) handleAvatarChange(f);
						}} />
					</label>
				</div>
				<div className="flex-1 space-y-4">
					<div>
						<label className="block text-sm text-white/60 mb-1">Nama</label>
						<input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
							className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
					</div>
					<div>
						<label className="block text-sm text-white/60 mb-1">Bio</label>
						<textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
							className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
					</div>
					<button onClick={save} disabled={saving}
						className="px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-400 disabled:opacity-60">
						{saving ? 'Menyimpan...' : 'Simpan'}
					</button>
				</div>
			</div>
		</div>
	);
}