'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { Briefcase, Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

function HeaderContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lang = searchParams.get('lang') || 'az'
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLabels: Record<string, Record<string, string>> = {
    az: { home: 'Ana Səhifə', jobs: 'Vakansiyalar', categories: 'Kateqoriyalar', about: 'Haqqımızda', contact: 'Əlaqə' },
    en: { home: 'Home', jobs: 'Jobs', categories: 'Categories', about: 'About', contact: 'Contact' },
    ru: { home: 'Главная', jobs: 'Вакансии', categories: 'Категории', about: 'О нас', contact: 'Контакт' },
  }

  const t = navLabels[lang] || navLabels.az

  const navItems = [
    { href: `/?lang=${lang}`, label: t.home },
    { href: `/jobs?lang=${lang}`, label: t.jobs },
    { href: `/categories?lang=${lang}`, label: t.categories },
    { href: `/about?lang=${lang}`, label: t.about },
    { href: `/contact?lang=${lang}`, label: t.contact },
  ]

  const isActive = (href: string) => {
    const path = href.split('?')[0]
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/?lang=${lang}`} className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span>İş<span className="text-blue-400">Tap</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 text-sm font-medium rounded-lg mx-1 transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16" />
    }>
      <HeaderContent />
    </Suspense>
  )
}
