'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/categorizer';
import { X } from 'lucide-react';

const LOCATIONS = ['Bakı', 'Sumqayıt', 'Gəncə', 'Mingəçevir', 'Lənkəran', 'Naxçıvan'];

const SOURCES = ['boss.az', 'jobsearch.az', 'hellojob.az', 'smartjob.az', 'ejob.az', 'iseqebul.az', 'jooble.az', 'hrin.az'];

const JOB_TYPES = [
  { value: 'full-time',  az: 'Tam ştat',   en: 'Full-time',  ru: 'Полная занятость' },
  { value: 'part-time',  az: 'Yarım ştat', en: 'Part-time',  ru: 'Частичная занятость' },
  { value: 'contract',   az: 'Müqavilə',   en: 'Contract',   ru: 'Контракт' },
  { value: 'internship', az: 'Təcrübə',    en: 'Internship', ru: 'Стажировка' },
];

const WORK_MODES = [
  { value: 'office', az: 'Ofis',    en: 'Office',  ru: 'Офис' },
  { value: 'remote', az: 'Uzaqdan', en: 'Remote',  ru: 'Удалённо' },
  { value: 'hybrid', az: 'Hibrid',  en: 'Hybrid',  ru: 'Гибрид' },
];

const EXP_LEVELS = [
  { value: 'junior', az: 'Junior',  en: 'Junior',  ru: 'Junior' },
  { value: 'mid',    az: 'Middle',  en: 'Middle',  ru: 'Middle' },
  { value: 'senior', az: 'Senior',  en: 'Senior',  ru: 'Senior' },
];

const DATE_OPTIONS = [
  { value: 'today', az: 'Bu gün',   en: 'Today',      ru: 'Сегодня' },
  { value: 'week',  az: 'Bu həftə', en: 'This week',  ru: 'На этой неделе' },
  { value: 'month', az: 'Bu ay',    en: 'This month', ru: 'В этом месяце' },
];

const LABELS: Record<string, Record<string, string>> = {
  az: {
    filters: 'Filtrlər', category: 'Kateqoriya', location: 'Şəhər',
    jobType: 'İş növü', workMode: 'İş rejimi', experience: 'Səviyyə',
    source: 'Mənbə', date: 'Tarix', clearFilters: 'Filtrləri sil',
    allCategories: 'Bütün kateqoriyalar', allLocations: 'Bütün şəhərlər',
    allTypes: 'Hamısı', allSources: 'Bütün mənbələr', allDates: 'İstənilən tarix',
  },
  en: {
    filters: 'Filters', category: 'Category', location: 'City',
    jobType: 'Job type', workMode: 'Work mode', experience: 'Level',
    source: 'Source', date: 'Date', clearFilters: 'Clear filters',
    allCategories: 'All categories', allLocations: 'All cities',
    allTypes: 'All', allSources: 'All sources', allDates: 'Any date',
  },
  ru: {
    filters: 'Фильтры', category: 'Категория', location: 'Город',
    jobType: 'Тип работы', workMode: 'Режим работы', experience: 'Уровень',
    source: 'Источник', date: 'Дата', clearFilters: 'Сбросить',
    allCategories: 'Все категории', allLocations: 'Все города',
    allTypes: 'Все', allSources: 'Все источники', allDates: 'Любая дата',
  },
};

function FilterPanelContent({ lang = 'az' }: { lang?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = LABELS[lang] || LABELS.az;

  const get = (k: string) => searchParams.get(k) || '';
  const currentCategory = get('category');
  const currentLocation = get('location');
  const currentJobType  = get('jobType') || get('job_type');
  const currentWorkMode = get('workMode') || get('work_mode');
  const currentExpLevel = get('experienceLevel');
  const currentSource   = get('source');
  const currentDate     = get('date');

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    params.set('lang', lang);
    router.push(`/jobs?${params.toString()}`);
  }

  function clearFilters() {
    router.push(`/jobs?lang=${lang}`);
  }

  const hasFilters = currentCategory || currentLocation || currentJobType || currentWorkMode || currentExpLevel || currentSource || currentDate;

  const selectClass = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900">{t.filters}</h3>
        {hasFilters && (
          <button onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
            <X className="w-3 h-3" /> {t.clearFilters}
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Category */}
        <div>
          <label className={labelClass}>{t.category}</label>
          <select value={currentCategory} onChange={e => updateFilter('category', e.target.value)} className={selectClass}>
            <option value="">{t.allCategories}</option>
            {CATEGORIES.map(cat => (
              <option key={cat.slug} value={cat.slug}>
                {cat.emoji} {lang === 'en' ? cat.labelEn : lang === 'ru' ? cat.labelRu : cat.labelAz}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className={labelClass}>{t.location}</label>
          <select value={currentLocation} onChange={e => updateFilter('location', e.target.value)} className={selectClass}>
            <option value="">{t.allLocations}</option>
            {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        {/* Job Type */}
        <div>
          <label className={labelClass}>{t.jobType}</label>
          <select value={currentJobType} onChange={e => updateFilter('jobType', e.target.value)} className={selectClass}>
            <option value="">{t.allTypes}</option>
            {JOB_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {lang === 'en' ? type.en : lang === 'ru' ? type.ru : type.az}
              </option>
            ))}
          </select>
        </div>

        {/* Work Mode */}
        <div>
          <label className={labelClass}>{t.workMode}</label>
          <div className="flex flex-wrap gap-1.5">
            {WORK_MODES.map(mode => (
              <button key={mode.value}
                onClick={() => updateFilter('workMode', currentWorkMode === mode.value ? '' : mode.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  currentWorkMode === mode.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}>
                {lang === 'en' ? mode.en : lang === 'ru' ? mode.ru : mode.az}
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className={labelClass}>{t.experience}</label>
          <div className="flex flex-wrap gap-1.5">
            {EXP_LEVELS.map(level => (
              <button key={level.value}
                onClick={() => updateFilter('experienceLevel', currentExpLevel === level.value ? '' : level.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  currentExpLevel === level.value
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                }`}>
                {lang === 'en' ? level.en : lang === 'ru' ? level.ru : level.az}
              </button>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label className={labelClass}>{t.source}</label>
          <select value={currentSource} onChange={e => updateFilter('source', e.target.value)} className={selectClass}>
            <option value="">{t.allSources}</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className={labelClass}>{t.date}</label>
          <div className="flex flex-wrap gap-1.5">
            {DATE_OPTIONS.map(d => (
              <button key={d.value}
                onClick={() => updateFilter('date', currentDate === d.value ? '' : d.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  currentDate === d.value
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                }`}>
                {lang === 'en' ? d.en : lang === 'ru' ? d.ru : d.az}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FilterPanel({ lang = 'az' }: { lang?: string }) {
  return (
    <Suspense fallback={<div className="w-64 h-96 bg-gray-100 rounded-xl animate-pulse" />}>
      <FilterPanelContent lang={lang} />
    </Suspense>
  );
}
