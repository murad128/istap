'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  lang?: string;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, lang = 'az', onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const labels = {
    az: { prev: 'Əvvəlki', next: 'Növbəti' },
    en: { prev: 'Previous', next: 'Next' },
    ru: { prev: 'Назад', next: 'Вперёд' },
  };
  const t = labels[lang as keyof typeof labels] || labels.az;

  // Build visible page range
  const delta = 2;
  const range: (number | 'ellipsis')[] = [];
  const rangeWithDots: (number | 'ellipsis')[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      range.push(i);
    }
  }

  let prev = 0;
  for (const p of range) {
    if (typeof p === 'number') {
      if (prev && p - prev > 1) rangeWithDots.push('ellipsis');
      rangeWithDots.push(p);
      prev = p;
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        {t.prev}
      </button>

      {rangeWithDots.map((p, idx) =>
        p === 'ellipsis' ? (
          <span key={`e-${idx}`} className="px-2 py-2 text-gray-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
              p === page
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {t.next}
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
