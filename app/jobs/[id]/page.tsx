import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { CATEGORIES } from '@/lib/categorizer';
import JobCard from '@/components/JobCard';
import ViewTracker from '@/components/ViewTracker';

export async function generateMetadata({ params, searchParams }: any) {
  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job) return {};
  return {
    title: `${job.titleAz} — ${job.company} | İşTap`,
    description: (job.descriptionAz || '').slice(0, 160),
    openGraph: {
      title: `${job.titleAz} | İşTap`,
      description: (job.descriptionAz || '').slice(0, 160),
    },
  };
}

const SOURCE_COLORS: Record<string, string> = {
  'boss.az': '#e74c3c', 'jobsearch.az': '#3498db', 'hellojob.az': '#2ecc71',
  'smartjob.az': '#9b59b6', 'ejob.az': '#f39c12', 'iseqebul.az': '#1abc9c',
  'jooble.az': '#e67e22', 'hrin.az': '#34495e',
};

const JOB_TYPE_LABELS: Record<string, Record<string, string>> = {
  'full-time': { az: 'Tam ştat', en: 'Full-time', ru: 'Полная занятость' },
  'part-time': { az: 'Yarım ştat', en: 'Part-time', ru: 'Частичная занятость' },
  contract: { az: 'Müqavilə', en: 'Contract', ru: 'Контракт' },
  internship: { az: 'Təcrübə', en: 'Internship', ru: 'Стажировка' },
};

const WORK_MODE_LABELS: Record<string, Record<string, string>> = {
  office: { az: 'Ofis', en: 'Office', ru: 'Офис' },
  remote: { az: 'Uzaqdan', en: 'Remote', ru: 'Удалённо' },
  hybrid: { az: 'Hibrid', en: 'Hybrid', ru: 'Гибрид' },
};

export default async function JobDetailPage({ params, searchParams }: any) {
  const lang = (searchParams?.lang || 'az') as 'az' | 'en' | 'ru';

  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job) notFound();

  const similar = await prisma.job.findMany({
    where: {
      categorySlug: job.categorySlug || undefined,
      status: 'active',
      id: { not: job.id },
    },
    orderBy: { publishDate: 'desc' },
    take: 4,
    select: {
      id: true, titleAz: true, titleEn: true, titleRu: true,
      company: true, location: true, salary: true, jobType: true,
      workMode: true, categorySlug: true, sourceName: true,
      publishDate: true, status: true,
    },
  });

  // Language-aware field selection with fallback to AZ
  const title = lang === 'en' ? (job.titleEn || job.titleAz)
    : lang === 'ru' ? (job.titleRu || job.titleAz)
    : job.titleAz;

  const desc = lang === 'en' ? (job.descriptionEn || job.descriptionAz)
    : lang === 'ru' ? (job.descriptionRu || job.descriptionAz)
    : job.descriptionAz;

  const reqs = lang === 'en' ? (job.requirementsEn || job.requirementsAz)
    : lang === 'ru' ? (job.requirementsRu || job.requirementsAz)
    : job.requirementsAz;

  const resps = lang === 'en' ? (job.responsibilitiesEn || job.responsibilitiesAz)
    : lang === 'ru' ? (job.responsibilitiesRu || job.responsibilitiesAz)
    : job.responsibilitiesAz;

  const category = job.categorySlug ? CATEGORIES.find(c => c.slug === job.categorySlug) : null;
  const categoryName = category
    ? (lang === 'en' ? category.labelEn : lang === 'ru' ? category.labelRu : category.labelAz)
    : null;

  const sourceColor = SOURCE_COLORS[job.sourceName] || '#6b7280';
  const jobTypeLabel = job.jobType ? JOB_TYPE_LABELS[job.jobType]?.[lang] || job.jobType : null;
  const workModeLabel = job.workMode ? WORK_MODE_LABELS[job.workMode]?.[lang] || job.workMode : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.titleAz,
    description: job.descriptionAz || '',
    hiringOrganization: { '@type': 'Organization', name: job.company },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'AZ' } },
    datePosted: job.publishDate?.toISOString(),
    validThrough: job.expiryDate?.toISOString(),
    employmentType: job.jobType?.toUpperCase().replace('-', '_') || 'FULL_TIME',
    url: job.sourceUrl,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={`/?lang=${lang}`} className="hover:text-blue-600">
          {lang === 'az' ? 'Ana Səhifə' : lang === 'en' ? 'Home' : 'Главная'}
        </Link>
        <span>/</span>
        <Link href={`/jobs?lang=${lang}`} className="hover:text-blue-600">
          {lang === 'az' ? 'Vakansiyalar' : lang === 'en' ? 'Jobs' : 'Вакансии'}
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{title}</span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-5 shadow-sm">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ background: sourceColor }}>
            {job.company.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{title}</h1>
            <p className="text-gray-600 font-medium text-lg">{job.company}</p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white flex-shrink-0"
            style={{ background: sourceColor }}>
            {job.sourceName}
          </span>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
            📍 {job.location}
          </span>
          {job.salary && (
            <span className="inline-flex items-center gap-1.5 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
              💰 {job.salary}
            </span>
          )}
          {jobTypeLabel && (
            <span className="inline-flex items-center gap-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
              💼 {jobTypeLabel}
            </span>
          )}
          {workModeLabel && (
            <span className="inline-flex items-center gap-1.5 text-sm text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full">
              🖥️ {workModeLabel}
            </span>
          )}
          {categoryName && category && (
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
              {category.emoji} {categoryName}
            </span>
          )}
          {job.publishDate && (
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
              📅 {new Date(job.publishDate).toLocaleDateString(lang === 'az' ? 'az-AZ' : lang === 'ru' ? 'ru-RU' : 'en-GB')}
            </span>
          )}
          {job.expiryDate && (
            <span className="inline-flex items-center gap-1.5 text-sm text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full">
              ⏳ {lang === 'az' ? 'Son müraciət:' : lang === 'en' ? 'Apply by:' : 'Подать до:'} {new Date(job.expiryDate).toLocaleDateString(lang === 'az' ? 'az-AZ' : lang === 'ru' ? 'ru-RU' : 'en-GB')}
            </span>
          )}
        </div>

        {/* Apply button */}
        <div className="flex items-center gap-4 flex-wrap">
          <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            {lang === 'az' ? 'Müraciət et' : lang === 'en' ? 'Apply Now' : 'Откликнуться'}
            <span>→</span>
          </a>
          <ViewTracker jobId={job.id} initialCount={job.viewCount} lang={lang} />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {lang === 'az' ? 'Mənbə: ' : lang === 'en' ? 'Source: ' : 'Источник: '}
          <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {job.sourceName}
          </a>
        </p>
      </div>

      {/* Description */}
      {desc && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-5 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-900">
            {lang === 'az' ? 'Vakansiya haqqında' : lang === 'en' ? 'About the role' : 'О вакансии'}
          </h2>
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{desc}</div>
        </div>
      )}

      {/* Requirements */}
      {reqs && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-5 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-900">
            {lang === 'az' ? 'Tələblər' : lang === 'en' ? 'Requirements' : 'Требования'}
          </h2>
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{reqs}</div>
        </div>
      )}

      {/* Responsibilities */}
      {resps && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-5 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-900">
            {lang === 'az' ? 'Vəzifə öhdəlikləri' : lang === 'en' ? 'Responsibilities' : 'Обязанности'}
          </h2>
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{resps}</div>
        </div>
      )}

      {/* Similar jobs */}
      {similar.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-4 text-gray-900">
            {lang === 'az' ? 'Oxşar vakansiyalar' : lang === 'en' ? 'Similar jobs' : 'Похожие вакансии'}
          </h2>
          <div className="space-y-3">
            {similar.map((j: any) => (
              <JobCard
                key={j.id}
                job={{ ...j, publishDate: j.publishDate ? new Date(j.publishDate).toISOString() : null }}
                lang={lang}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
