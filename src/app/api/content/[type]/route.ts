import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { checkAndIncrementApiUsage } from '@/lib/rateLimiter';

export async function GET(req: NextRequest, { params }: { params: { type: string } }) {
	const auth = await getAuthContext(req);
	if (auth.isBlocked) {
		return NextResponse.json({ error: 'blocked' }, { status: 403 });
	}
	const limitCheck = await checkAndIncrementApiUsage(auth.userId);
	if (!limitCheck.allowed) {
		return NextResponse.json({ error: 'Monthly API limit reached' }, { status: 429 });
	}
	const { type } = params;
	const items = [
		{ id: '1', title: 'Sample A', type },
		{ id: '2', title: 'Sample B', type },
	];
	return NextResponse.json({ items, usage: limitCheck });
}