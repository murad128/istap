import Link from 'next/link'
import { CATEGORIES } from '@/lib/categorizer'

interface Job {
  id: string
  titleAz: string
  titleEn?: string | null
  titleRu?: string | null
  company: string
  location: string
  salary?: string | null
  jobType?: string | null
  workMode?: string | null
  categorySlug?: string | null
  sourceName: string
  publishDate?: string | Date | null
  status: string
  viewCount?: number
}

const SOURCE_COLORS: Record<string, string> = {
  'boss.az':      '#e74c3c',
  'jobsearch.az': '#3498db',
  'hellojob.az':  '#2ecc71',
  'smartjob.az':  '#9b59b6',
  'ejob.az':      '#f39c12',
  'iseqebul.az':  '#1abc9c',
  'jooble.az':    '#e67e22',
  'hrin.az':      '#34495e',
}

const JOB_TYPE_LABELS: Record<string, Record<string, string>> = {
  'full-time':  { az: 'Tam ştat',   en: 'Full-time',  ru: 'Полная' },
  'part-time':  { az: 'Yarım ştat', en: 'Part-time',  ru: 'Частичная' },
  contract:     { az: 'Müqavilə',   en: 'Contract',   ru: 'Контракт' },
  internship:   { az: 'Təcrübə',    en: 'Internship', ru: 'Стажировка' },
}

const WORK_MODE_LABELS: Record<string, Record<string, string>> = {
  office: { az: 'Ofis',    en: 'Office', ru: 'Офис' },
  remote: { az: 'Remote',  en: 'Remote', ru: 'Удалённо' },
  hybrid: { az: 'Hibrid',  en: 'Hybrid', ru: 'Гибрид' },
}

function timeAgo(date: string | Date | null | undefined, lang: string): string {
  if (!date) return ''
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days <= 0) return lang === 'ru' ? 'Сегодня' : lang === 'en' ? 'Today' : 'Bu gün'
  if (days === 1) return lang === 'ru' ? 'Вчера' : lang === 'en' ? 'Yesterday' : 'Dünən'
  if (days < 30) {
    if (lang === 'ru') return `${days} дн. назад`
    if (lang === 'en') return `${days}d ago`
    return `${days} gün əvvəl`
  }
  return d.toLocaleDateString(lang === 'az' ? 'az-AZ' : lang === 'ru' ? 'ru-RU' : 'en-GB')
}

interface JobCardProps {
  job: Job
  lang?: string
}

export default function JobCard({ job, lang = 'az' }: JobCardProps) {
  const title =
    lang === 'en' ? (job.titleEn || job.titleAz) :
    lang === 'ru' ? (job.titleRu || job.titleAz) :
    job.titleAz

  const category = job.categorySlug ? CATEGORIES.find(c => c.slug === job.categorySlug) : null
  const sourceColor = SOURCE_COLORS[job.sourceName] || '#6b7280'
  const posted = timeAgo(job.publishDate, lang)
  const jobTypeLabel = job.jobType ? JOB_TYPE_LABELS[job.jobType]?.[lang] : null
  const workModeLabel = job.workMode ? WORK_MODE_LABELS[job.workMode]?.[lang] : null

  return (
    <Link href={`/jobs/${job.id}?lang=${lang}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-150">
        
        {/* Row 1: Title + Source badge */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5 truncate">{job.company}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-white leading-tight"
              style={{ backgroundColor: sourceColor }}
            >
              {job.sourceName}
            </span>
            {category && (
              <span className="text-base" title={lang === 'en' ? category.labelEn : lang === 'ru' ? category.labelRu : category.labelAz}>
                {category.emoji}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Salary + badges */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {job.salary && (
            <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              💰 {job.salary}
            </span>
          )}
          {jobTypeLabel && (
            <span className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              {jobTypeLabel}
            </span>
          )}
          {workModeLabel && (
            <span className="text-xs text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
              {workModeLabel}
            </span>
          )}
        </div>

        {/* Row 3: Location · Date · Views */}
        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
          <span className="flex items-center gap-1">
            <span>📍</span>
            <span>{job.location}</span>
          </span>
          {posted && (
            <span className="flex items-center gap-1">
              <span>🕒</span>
              <span>{posted}</span>
            </span>
          )}
          {!!job.viewCount && job.viewCount > 0 && (
            <span className="flex items-center gap-1">
              <span>👁</span>
              <span>{job.viewCount}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
