"use client";
import { ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import AuthButtons from './AuthButtons';

export default function AuthGate({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();
	if (loading) return null;
	if (!user) {
		return (
			<div className="rounded-lg border border-white/10 p-6 text-center">
				<p className="mb-4 text-white/80">Silakan masuk untuk melanjutkan.</p>
				<AuthButtons />
			</div>
		);
	}
	return <>{children}</>;
}