import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, name: 'ZVHive', time: new Date().toISOString() });
}