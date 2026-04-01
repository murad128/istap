'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const LANGUAGES = [
  { code: 'az', label: 'AZ' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
]

function LanguageSwitcherContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentLang = searchParams.get('lang') || 'az'

  function switchLang(lang: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', lang)
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLang(code)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
            currentLang === code
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function LanguageSwitcher() {
  return (
    <Suspense fallback={
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
        <div className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-white rounded-md shadow-sm">AZ</div>
      </div>
    }>
      <LanguageSwitcherContent />
    </Suspense>
  )
}
