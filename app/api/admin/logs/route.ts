export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const logs = await prisma.importLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json(logs);
}
