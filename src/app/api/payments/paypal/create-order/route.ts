import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/payments/paypal';
import { getAuthContext } from '@/lib/auth';

export async function POST(req: NextRequest) {
	const auth = await getAuthContext(req);
	if (!auth.isAuthenticated || auth.isBlocked) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
	const body = await req.json().catch(() => ({ total: '5.00', currency: 'USD' }));
	const result = await createOrder(body.total ?? '5.00', body.currency ?? 'USD');
	return NextResponse.json(result);
}