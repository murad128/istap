import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const similar = await prisma.job.findMany({
    where: { categorySlug: job.categorySlug || undefined, status: 'active', id: { not: job.id } },
    orderBy: { publishDate: 'desc' },
    take: 5,
    select: { id: true, titleAz: true, company: true, location: true, salary: true, sourceName: true, publishDate: true },
  });

  return NextResponse.json({ job, similar });
}
