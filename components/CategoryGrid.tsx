import Link from 'next/link';
import { CATEGORIES } from '@/lib/categorizer';

interface CategoryCount {
  categorySlug: string;
  _count: number;
}

interface CategoryGridProps {
  counts?: CategoryCount[];
  lang?: string;
  limit?: number;
}

export default function CategoryGrid({ counts = [], lang = 'az', limit }: CategoryGridProps) {
  const countMap: Record<string, number> = {};
  counts.forEach(c => { countMap[c.categorySlug] = c._count; });

  const categories = limit ? CATEGORIES.slice(0, limit) : CATEGORIES;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {categories.map(cat => {
        const count = countMap[cat.slug] || 0;
        const name = lang === 'en' ? cat.labelEn : lang === 'ru' ? cat.labelRu : cat.labelAz;

        return (
          <Link
            key={cat.slug}
            href={`/jobs?category=${cat.slug}&lang=${lang}`}
            className="group bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center text-center hover:border-blue-400 hover:shadow-md transition-all"
          >
            <span className="text-2xl mb-1.5 block">{cat.emoji}</span>
            <span className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 leading-tight block w-full break-words">
              {name}
            </span>
            {count > 0 && (
              <span className="text-xs text-gray-400 mt-0.5 block">{count}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
