import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { checkAndIncrementApiUsage } from '@/lib/rateLimiter';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	const auth = await getAuthContext(req);
	if (auth.isBlocked) {
		return NextResponse.json({ error: 'blocked' }, { status: 403 });
	}
	const limitCheck = await checkAndIncrementApiUsage(auth.userId);
	if (!limitCheck.allowed) {
		return NextResponse.json({ error: 'Monthly API limit reached' }, { status: 429 });
	}
	return NextResponse.json({ id: params.id, pages: ['page1.jpg', 'page2.jpg'], usage: limitCheck });
}