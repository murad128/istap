import Link from 'next/link'
import { Briefcase, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span>İş<span className="text-blue-400">Tap</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Azərbaycanda iş axtaranlar üçün etibarlı platforma. Etibarlı mənbələrdən aktual vakansiyalar.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Bakı, Azərbaycan</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@istap.az" className="hover:text-white transition-colors">
                  info@istap.az
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sürətli Keçidlər</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Ana Səhifə' },
                { href: '/jobs', label: 'Bütün Vakansiyalar' },
                { href: '/categories', label: 'Kateqoriyalar' },
                { href: '/about', label: 'Haqqımızda' },
                { href: '/contact', label: 'Əlaqə' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Mənbələr</h3>
            <ul className="space-y-2 text-sm">
              {['boss.az', 'jobsearch.az', 'hellojob.az', 'smartjob.az', 'ejob.az', 'iseqebul.az', 'jooble.az', 'hrin.az'].map((source) => (
                <li key={source}>
                  <a href={`https://${source}`} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors">
                    {source}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {currentYear} İşTap — Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  )
}
