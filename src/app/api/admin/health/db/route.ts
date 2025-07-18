import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Simple query to check DB connection
    await prisma.user.count({ take: 1 });
    return NextResponse.json({ status: 'healthy' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'down', error: String(error) }, { status: 500 });
  }
}
