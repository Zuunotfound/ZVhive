import { NextRequest, NextResponse } from 'next/server';
import { captureOrder } from '@/lib/payments/paypal';
import { getAuthContext } from '@/lib/auth';

export async function POST(req: NextRequest) {
	const auth = await getAuthContext(req);
	if (!auth.isAuthenticated || auth.isBlocked) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
	const body = await req.json();
	if (!body?.orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });
	const result = await captureOrder(body.orderId);
	return NextResponse.json(result);
}