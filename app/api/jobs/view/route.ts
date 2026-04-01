export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { jobId, sessionId } = await req.json().catch(() => ({}));
  if (!jobId || !sessionId) return NextResponse.json({ ok: false });

  try {
    // Upsert: one view per session per job
    await prisma.jobView.create({ data: { jobId, sessionId } });
    // Increment view counter
    const updated = await prisma.job.update({
      where: { id: jobId },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });
    return NextResponse.json({ ok: true, viewCount: updated.viewCount });
  } catch {
    // Unique constraint = already counted, just return current count
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { viewCount: true },
    });
    return NextResponse.json({ ok: false, viewCount: job?.viewCount || 0 });
  }
}
