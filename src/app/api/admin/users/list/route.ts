import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase/admin';

export async function GET(req: NextRequest) {
	const auth = await getAuthContext(req);
	if (!auth.isAuthenticated || !auth.isAdmin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
	const list = await adminAuth().listUsers(1000);
	const users = list.users.map(u => ({ uid: u.uid, email: u.email, displayName: u.displayName, disabled: u.disabled, customClaims: u.customClaims }));
	return NextResponse.json({ users });
}