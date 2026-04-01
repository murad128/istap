import Link from 'next/link';
import { prisma } from '@/lib/db';
import { CATEGORIES } from '@/lib/categorizer';

// Server component — no Suspense issues, no hydration bugs
export default async function CategoriesPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const lang = (searchParams?.lang || 'az') as 'az' | 'en' | 'ru';

  // Get counts server-side from DB directly
  const counts = await prisma.job.groupBy({
    by: ['categorySlug'],
    where: { status: 'active', categorySlug: { not: null } },
    _count: { id: true },
  });

  const countMap: Record<string, number> = {};
  counts.forEach(c => { if (c.categorySlug) countMap[c.categorySlug] = c._count.id; });

  const headings = {
    az: { title: 'Kateqoriyalar', sub: 'Sahənizə uyğun vakansiyaları tapın' },
    en: { title: 'Categories', sub: 'Find jobs in your field' },
    ru: { title: 'Категории', sub: 'Найдите работу в своей области' },
  };
  const h = headings[lang];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">{h.title}</h1>
      <p className="text-gray-500 mb-8">{h.sub}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {CATEGORIES.map(cat => {
          const count = countMap[cat.slug] || 0;
          const name = lang === 'en' ? cat.labelEn : lang === 'ru' ? cat.labelRu : cat.labelAz;

          return (
            <Link
              key={cat.slug}
              href={`/jobs?category=${cat.slug}&lang=${lang}`}
              className="group bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center text-center hover:border-blue-400 hover:shadow-md transition-all"
            >
              {/* Icon */}
              <span className="text-3xl mb-2 block">{cat.emoji}</span>

              {/* Name — always visible, no color tricks */}
              <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 leading-tight block w-full">
                {name}
              </span>

              {/* Count */}
              <span className="text-xs text-gray-400 mt-1 block">
                {count} {lang === 'en' ? 'jobs' : lang === 'ru' ? 'вак.' : 'vakansiya'}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
