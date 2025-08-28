"use client";
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase/client';
import { useAuth } from './AuthProvider';
import { useUserRole } from '@/hooks/useUserRole';
import VerifiedBadge from './VerifiedBadge';

export default function AuthButtons() {
	const { user, loading } = useAuth();
	const role = useUserRole();
	if (loading) return null;
	if (!user) {
		return (
			<button
				onClick={async () => {
					const provider = new GoogleAuthProvider();
					await signInWithPopup(firebaseAuth, provider);
				}}
				className="px-3 py-1.5 rounded-md bg-brand-500 hover:bg-brand-400 text-sm"
			>
				Masuk
			</button>
		);
	}
	return (
		<div className="flex items-center gap-3">
			<span className="text-white/70 text-sm flex items-center gap-2">
				{user.displayName ?? user.email}
				{role?.isVerified ? <VerifiedBadge /> : null}
			</span>
			<button
				onClick={async () => {
					await signOut(firebaseAuth);
				}}
				className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-sm"
			>
				Keluar
			</button>
		</div>
	);
}