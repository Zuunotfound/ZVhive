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
	return NextResponse.json({ id: params.id, sources: [{ quality: '720p', url: 'https://example.com/stream.m3u8' }], usage: limitCheck });
}