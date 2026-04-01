import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CATEGORIES } from '@/lib/categorizer';

export async function GET() {
  const counts = await prisma.job.groupBy({
    by: ['categorySlug'],
    where: { status: 'active' },
    _count: { id: true },
  });

  const countMap: Record<string, number> = {};
  counts.forEach(c => { if (c.categorySlug) countMap[c.categorySlug] = c._count.id; });

  const categories = CATEGORIES.map(cat => ({
    ...cat,
    count: countMap[cat.slug] || 0,
  }));

  return NextResponse.json(categories);
}
