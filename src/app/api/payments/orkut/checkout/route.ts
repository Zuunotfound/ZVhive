import { NextResponse } from 'next/server';

export async function POST() {
	return NextResponse.json({
		ok: true,
		message: 'Orkut gateway placeholder. Integrate your local PSP SDK here.',
	});
}