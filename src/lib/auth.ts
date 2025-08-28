import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from './firebase/admin';

export type AuthContext = {
	userId: string | null;
	isAuthenticated: boolean;
	isAdmin?: boolean;
	isVerified?: boolean;
	isBlocked?: boolean;
};

export async function getAuthContext(req: NextRequest): Promise<AuthContext> {
	const authHeader = req.headers.get('authorization') || '';
	const token = authHeader.startsWith('Bearer ')
		? authHeader.substring('Bearer '.length)
		: null;
	if (!token) return { userId: null, isAuthenticated: false };
	try {
		const decoded = await adminAuth().verifyIdToken(token);
		const userId = decoded.uid;
		const roleSnap = await adminDb().collection('roles').doc(userId).get();
		const role = (roleSnap.exists ? roleSnap.data() : {}) as any;
		return {
			userId,
			isAuthenticated: true,
			isAdmin: !!role?.isAdmin || !!role?.isDeveloper,
			isVerified: !!role?.isVerified,
			isBlocked: !!role?.isBlocked,
		};
	} catch {
		return { userId: null, isAuthenticated: false };
	}
}