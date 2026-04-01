import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page    = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit   = Math.min(50, parseInt(searchParams.get('limit') || '20'));
  const q       = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const city    = searchParams.get('city') || searchParams.get('location') || '';
  const jobType = searchParams.get('job_type') || searchParams.get('jobType') || '';
  const workMode = searchParams.get('work_mode') || searchParams.get('workMode') || '';
  const expLevel = searchParams.get('experience_level') || searchParams.get('experienceLevel') || '';
  const source  = searchParams.get('source') || '';
  const salaryMin = parseInt(searchParams.get('salary_min') || '0') || 0;
  const salaryMax = parseInt(searchParams.get('salary_max') || '0') || 0;
  const sort    = searchParams.get('sort') || 'newest';
  // date filter: today / week / month
  const dateFilter = searchParams.get('date') || '';

  const where: any = { status: 'active' };
  if (category) where.categorySlug = category;
  if (city) where.location = { contains: city };
  if (jobType) where.jobType = jobType;
  if (workMode) where.workMode = workMode;
  if (expLevel) where.experienceLevel = expLevel;
  if (source) where.sourceName = source;
  if (salaryMin > 0) where.salaryMin = { gte: salaryMin };
  if (salaryMax > 0) where.salaryMax = { lte: salaryMax };

  if (dateFilter) {
    const now = new Date();
    let from: Date | null = null;
    if (dateFilter === 'today') from = new Date(now.setHours(0,0,0,0));
    else if (dateFilter === 'week') from = new Date(Date.now() - 7 * 86400000);
    else if (dateFilter === 'month') from = new Date(Date.now() - 30 * 86400000);
    if (from) where.publishDate = { gte: from };
  }

  if (q.trim()) {
    where.OR = [
      { titleAz: { contains: q } },
      { titleEn: { contains: q } },
      { company: { contains: q } },
      { descriptionAz: { contains: q } },
    ];
  }

  // Build orderBy
  let orderBy: any = { publishDate: 'desc' };
  switch (sort) {
    case 'oldest':      orderBy = { publishDate: 'asc' }; break;
    case 'most_viewed': orderBy = { viewCount: 'desc' }; break;
    case 'updated':     orderBy = { updatedAt: 'desc' }; break;
    case 'salary_high': orderBy = [{ salaryMax: 'desc' }, { publishDate: 'desc' }]; break;
    case 'salary_low':  orderBy = [{ salaryMin: 'asc' }, { publishDate: 'desc' }]; break;
    default:            orderBy = { publishDate: 'desc' };
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        titleAz: true, titleEn: true, titleRu: true,
        company: true, location: true, salary: true,
        salaryMin: true, salaryMax: true,
        jobType: true, workMode: true, experienceLevel: true,
        categorySlug: true, sourceName: true, sourceUrl: true,
        publishDate: true, expiryDate: true, status: true,
        viewCount: true,
      },
    }),
    prisma.job.count({ where }),
  ]);

  return NextResponse.json({ jobs, total, page, totalPages: Math.ceil(total / limit) });
}
