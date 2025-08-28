import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { canReportBugOncePerDay } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
	const auth = await getAuthContext(req);
	if (auth.isBlocked) {
		return NextResponse.json({ error: 'blocked' }, { status: 403 });
	}
	const { allowed } = await canReportBugOncePerDay(auth.userId);
	if (!allowed) {
		return NextResponse.json({ error: 'Daily bug report limit reached' }, { status: 429 });
	}
	const body = await req.json().catch(() => ({ message: 'No body' }));
	return NextResponse.json({ ok: true, received: body, userId: auth.userId });
}