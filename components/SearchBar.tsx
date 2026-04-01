'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'

interface SearchBarProps {
  initialQuery?: string
  initialLocation?: string
  lang?: string
  onSearch?: (query: string, location: string) => void
  className?: string
}

const PLACEHOLDERS: Record<string, { query: string; location: string; button: string }> = {
  az: { query: 'Vəzifə, şirkət və ya açar söz...', location: 'Şəhər...', button: 'Axtar' },
  en: { query: 'Position, company or keyword...', location: 'City...', button: 'Search' },
  ru: { query: 'Должность, компания или ключевое слово...', location: 'Город...', button: 'Поиск' },
}

export default function SearchBar({
  initialQuery = '',
  initialLocation = '',
  lang = 'az',
  onSearch,
  className = '',
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)

  const p = PLACEHOLDERS[lang] || PLACEHOLDERS.az

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (onSearch) {
      onSearch(query, location)
    } else {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (location) params.set('location', location)
      params.set('lang', lang)
      router.push(`/jobs?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      {/* Query input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={p.query}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Location input */}
      <div className="relative sm:w-48">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={p.location}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-150 shadow-sm flex items-center gap-2 justify-center whitespace-nowrap"
      >
        <Search className="w-4 h-4" />
        {p.button}
      </button>
    </form>
  )
}
