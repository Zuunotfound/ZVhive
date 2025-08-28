import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
	const auth = await getAuthContext(req);
	if (!auth.isAuthenticated || !auth.isAdmin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
	const { email, password } = await req.json();
	if (!email || !password) return NextResponse.json({ error: 'email/password required' }, { status: 400 });
	const user = await adminAuth().createUser({ email, password, emailVerified: false, disabled: false });
	return NextResponse.json({ user });
}