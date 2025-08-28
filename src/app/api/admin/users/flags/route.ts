import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
	const auth = await getAuthContext(req);
	if (!auth.isAuthenticated || !auth.isAdmin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
	const { uid, field, value } = await req.json();
	if (!uid || !field) return NextResponse.json({ error: 'uid and field required' }, { status: 400 });
	await adminDb().collection('roles').doc(uid).set({ [field]: !!value }, { merge: true });
	return NextResponse.json({ ok: true });
}