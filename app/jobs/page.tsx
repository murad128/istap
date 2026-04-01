'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import JobCard from '@/components/JobCard';
import FilterPanel from '@/components/FilterPanel';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { SlidersHorizontal, X } from 'lucide-react';

const SORT_OPTIONS = {
  az: [
    { value: 'newest',      label: 'Ən yeni elanlar' },
    { value: 'oldest',      label: 'Ən köhnə elanlar' },
    { value: 'most_viewed', label: 'Ən çox baxılan' },
    { value: 'salary_high', label: 'Ən yüksək maaş' },
    { value: 'salary_low',  label: 'Ən aşağı maaş' },
    { value: 'updated',     label: 'Son yenilənən' },
  ],
  en: [
    { value: 'newest',      label: 'Newest first' },
    { value: 'oldest',      label: 'Oldest first' },
    { value: 'most_viewed', label: 'Most viewed' },
    { value: 'salary_high', label: 'Highest salary' },
    { value: 'salary_low',  label: 'Lowest salary' },
    { value: 'updated',     label: 'Recently updated' },
  ],
  ru: [
    { value: 'newest',      label: 'Сначала новые' },
    { value: 'oldest',      label: 'Сначала старые' },
    { value: 'most_viewed', label: 'Самые просматриваемые' },
    { value: 'salary_high', label: 'Самая высокая зарплата' },
    { value: 'salary_low',  label: 'Самая низкая зарплата' },
    { value: 'updated',     label: 'Недавно обновлённые' },
  ],
};

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = (searchParams.get('lang') || 'az') as 'az' | 'en' | 'ru';

  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const page     = parseInt(searchParams.get('page') || '1');
  const q        = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const city     = searchParams.get('location') || searchParams.get('city') || '';
  const jobType  = searchParams.get('jobType') || searchParams.get('job_type') || '';
  const workMode = searchParams.get('workMode') || searchParams.get('work_mode') || '';
  const expLevel = searchParams.get('experienceLevel') || '';
  const source   = searchParams.get('source') || '';
  const sort     = searchParams.get('sort') || 'newest';
  const date     = searchParams.get('date') || '';
  const salaryMin = searchParams.get('salary_min') || '';
  const salaryMax = searchParams.get('salary_max') || '';

  useEffect(() => {
    const params = new URLSearchParams();
    if (q)        params.set('q', q);
    if (category) params.set('category', category);
    if (city)     params.set('city', city);
    if (jobType)  params.set('job_type', jobType);
    if (workMode) params.set('work_mode', workMode);
    if (expLevel) params.set('experience_level', expLevel);
    if (source)   params.set('source', source);
    if (sort)     params.set('sort', sort);
    if (date)     params.set('date', date);
    if (salaryMin) params.set('salary_min', salaryMin);
    if (salaryMax) params.set('salary_max', salaryMax);
    params.set('page', String(page));

    setLoading(true);
    fetch(`/api/jobs?${params}`)
      .then(r => r.json())
      .then(d => { setJobs(d.jobs || []); setTotal(d.total || 0); setTotalPages(d.totalPages || 1); })
      .catch(() => { setJobs([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [q, category, city, jobType, workMode, expLevel, source, sort, date, salaryMin, salaryMax, page]);

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.set('page', '1');
    router.push(`/jobs?${p}`);
  };

  const sortOptions = SORT_OPTIONS[lang] || SORT_OPTIONS.az;

  const countLabel = total === 0 ? (lang === 'az' ? 'Vakansiya tapılmadı' : lang === 'en' ? 'No jobs found' : 'Вакансий не найдено')
    : lang === 'en' ? `${total} jobs found`
    : lang === 'ru' ? `Найдено ${total} вакансий`
    : `${total} vakansiya tapıldı`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search bar */}
      <div className="mb-5">
        <SearchBar lang={lang} initialQuery={q} initialLocation={city} />
      </div>

      <div className="flex gap-6">
        {/* Desktop filter sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <FilterPanel lang={lang} />
        </aside>

        {/* Mobile filter modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900">
                  {lang === 'az' ? 'Filtrlər' : lang === 'en' ? 'Filters' : 'Фильтры'}
                </span>
                <button onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel lang={lang} />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">
          {/* Toolbar: count + sort + mobile filter button */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <p className="text-sm text-gray-500">{countLabel}</p>
            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <button
                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-400"
                onClick={() => setMobileFilterOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {lang === 'az' ? 'Filtrlər' : lang === 'en' ? 'Filters' : 'Фильтры'}
              </button>

              {/* Sort dropdown */}
              <select
                value={sort}
                onChange={e => updateParam('sort', e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job list */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-medium">
                {lang === 'az' ? 'Vakansiya tapılmadı' : lang === 'en' ? 'No jobs found' : 'Вакансии не найдены'}
              </p>
              <p className="text-sm mt-2 text-gray-400">
                {lang === 'az' ? 'Filtrləri dəyişib yenidən cəhd edin' : lang === 'en' ? 'Try adjusting your filters' : 'Попробуйте изменить фильтры'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={{ ...job, publishDate: job.publishDate ? new Date(job.publishDate).toISOString() : null }}
                  lang={lang}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                page={page}
                totalPages={totalPages}
                lang={lang}
                onPageChange={p => updateParam('page', String(p))}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-3">
        {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}
