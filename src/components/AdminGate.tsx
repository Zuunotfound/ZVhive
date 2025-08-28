"use client";
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase/client';
import AuthButtons from './AuthButtons';

export default function AdminGate({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
	useEffect(() => {
		if (!user) return;
		getDoc(doc(firestoreDb, 'roles', user.uid)).then((snap) => {
			setIsAdmin(snap.exists() && !!(snap.data() as any)?.isAdmin);
		});
	}, [user]);
	if (loading) return null;
	if (!user) {
		return (
			<div className="rounded-lg border border-white/10 p-6 text-center">
				<p className="mb-4 text-white/80">Admin hanya untuk developer. Silakan masuk.</p>
				<AuthButtons />
			</div>
		);
	}
	if (isAdmin === false) return <div className="text-white/70">Tidak memiliki akses admin.</div>;
	if (isAdmin === null) return null;
	return <>{children}</>;
}