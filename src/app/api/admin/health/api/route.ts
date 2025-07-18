import { NextResponse } from 'next/server';

export async function GET() {
  // Simple API health check endpoint
  return NextResponse.json({ status: 'normal' }, { status: 200 });
}
