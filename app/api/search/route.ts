export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q') || '';
  if (!q.trim()) return NextResponse.json([]);

  const jobs = await prisma.job.findMany({
    where: {
      status: 'active',
      OR: [
        { titleAz: { contains: q } },
        { titleEn: { contains: q } },
        { company: { contains: q } },
        { location: { contains: q } },
        { descriptionAz: { contains: q } },
      ],
    },
    orderBy: { publishDate: 'desc' },
    take: 20,
    select: { id: true, titleAz: true, titleEn: true, company: true, location: true, salary: true, sourceName: true, categorySlug: true, publishDate: true },
  });

  return NextResponse.json(jobs);
}
