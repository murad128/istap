import Link from 'next/link'
import { Suspense } from 'react'
import { TrendingUp, Zap, RefreshCw } from 'lucide-react'
import prisma from '@/lib/db'
import SearchBar from '@/components/SearchBar'
import CategoryGrid from '@/components/CategoryGrid'
import JobCard from '@/components/JobCard'
import { getLangFromParam } from '@/lib/i18n'

interface PageProps {
  searchParams: { lang?: string }
}

async function getHomeData() {
  const [totalJobs, recentJobs, categoryCounts] = await Promise.all([
    prisma.job.count({ where: { status: 'active' } }),
    prisma.job.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: 9,
    }),
    prisma.job.groupBy({
      by: ['categorySlug'],
      where: { status: 'active', categorySlug: { not: null } },
      _count: true,
      orderBy: { _count: { categorySlug: 'desc' } },
    }),
  ])

  return { totalJobs, recentJobs, categoryCounts }
}

const HERO_TEXT = {
  az: {
    title: 'Azərbaycanda İş Tap',
    subtitle: 'Etibarlı mənbələrdən toplanmış aktual vakansiyalar — bir yerdə.',
    cta: 'Bütün vakansiyalara bax',
    recentJobs: 'Son Vakansiyalar',
    features: [
      { icon: '✅', title: 'Aktual elanlar', desc: 'Daim yenilənir' },
      { icon: '🔍', title: 'Asan axtarış', desc: 'Kateqoriya və filter' },
      { icon: '🌐', title: '3 Dil', desc: 'AZ / EN / RU' },
    ],
  },
  en: {
    title: 'Find Jobs in Azerbaijan',
    subtitle: 'Current vacancies from trusted platforms, all in one place.',
    cta: 'View all jobs',
    recentJobs: 'Recent Jobs',
    features: [
      { icon: '✅', title: 'Fresh listings', desc: 'Always up to date' },
      { icon: '🔍', title: 'Easy search', desc: 'Category & filter' },
      { icon: '🌐', title: '3 Languages', desc: 'AZ / EN / RU' },
    ],
  },
  ru: {
    title: 'Найти работу в Азербайджане',
    subtitle: 'Актуальные вакансии из надёжных источников — в одном месте.',
    cta: 'Все вакансии',
    recentJobs: 'Последние вакансии',
    features: [
      { icon: '✅', title: 'Свежие вакансии', desc: 'Постоянно обновляется' },
      { icon: '🔍', title: 'Удобный поиск', desc: 'Категории и фильтры' },
      { icon: '🌐', title: '3 Языка', desc: 'AZ / EN / RU' },
    ],
  },
}

export default async function HomePage({ searchParams }: PageProps) {
  const lang = getLangFromParam(searchParams.lang)
  const { totalJobs, recentJobs, categoryCounts } = await getHomeData()
  const t = HERO_TEXT[lang] || HERO_TEXT.az

  const formattedCounts = categoryCounts
    .filter((c) => c.categorySlug)
    .map((c) => ({
      categorySlug: c.categorySlug!,
      _count: c._count,
    }))

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            {totalJobs.toLocaleString()} iş elanı mövcuddur
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            {t.title}
          </h1>
          <p className="text-xl text-blue-100 mb-8">{t.subtitle}</p>

          <div className="max-w-2xl mx-auto">
            <SearchBar lang={lang} />
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {t.features.map((f) => (
              <div key={f.title} className="flex items-center gap-2 text-sm text-blue-100">
                <span className="text-xl">{f.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-white">{f.title}</div>
                  <div className="text-xs text-blue-200">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {lang === 'en' ? 'Categories' : lang === 'ru' ? 'Категории' : 'Kateqoriyalar'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {lang === 'en' ? 'Choose your field' : lang === 'ru' ? 'Выберите вашу сферу' : 'Sahənizi seçin'}
            </p>
          </div>
          <Link
            href={`/categories?lang=${lang}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {lang === 'en' ? 'View all' : lang === 'ru' ? 'Все' : 'Hamısı'}
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>
        <CategoryGrid counts={formattedCounts} lang={lang} limit={12} />
      </section>

      {/* Recent Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.recentJobs}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <RefreshCw className="w-3.5 h-3.5 text-green-500 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-gray-500 text-sm">
                {lang === 'en' ? 'Regularly updated' : lang === 'ru' ? 'Регулярно обновляется' : 'Mütəmadi yenilənir'}
              </span>
            </div>
          </div>
          <Link
            href={`/jobs?lang=${lang}`}
            className="btn-secondary text-sm"
          >
            {t.cta}
          </Link>
        </div>

        {recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={{
                  ...job,
                  publishDate: job.publishDate?.toISOString(),
                }}
                lang={lang}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Hələ vakansiya yoxdur. Admin panelindən import edin.</p>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href={`/jobs?lang=${lang}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            {t.cta}
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
