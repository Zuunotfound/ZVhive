"use client";
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { firebaseAuth } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';

type AuthState = { user: User | null; loading: boolean };
const Ctx = createContext<AuthState>({ user: null, loading: true });

export function useAuth() {
	return useContext(Ctx);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const unsub = onAuthStateChanged(firebaseAuth, (u) => {
			setUser(u);
			setLoading(false);
		});
		return () => unsub();
	}, []);
	return <Ctx.Provider value={{ user, loading }}>{children}</Ctx.Provider>;
}