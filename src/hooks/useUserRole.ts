"use client";
import { useAuth } from '@/components/AuthProvider';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestoreDb } from '@/lib/firebase/client';

type Role = { isAdmin?: boolean; isVerified?: boolean; isBlocked?: boolean };

export function useUserRole(): Role {
	const { user } = useAuth();
	const [role, setRole] = useState<Role>({});
	useEffect(() => {
		if (!user) return;
		const unsub = onSnapshot(doc(firestoreDb, 'roles', user.uid), (snap) => {
			setRole((snap.exists() ? (snap.data() as any) : {}) as Role);
		});
		return () => unsub();
	}, [user]);
	return role;
}