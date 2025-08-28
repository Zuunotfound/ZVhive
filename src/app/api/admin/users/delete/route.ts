import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
	const auth = await getAuthContext(req);
	if (!auth.isAuthenticated || !auth.isAdmin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
	const { uid } = await req.json();
	if (!uid) return NextResponse.json({ error: 'uid required' }, { status: 400 });
	await adminAuth().deleteUser(uid);
	return NextResponse.json({ ok: true });
}