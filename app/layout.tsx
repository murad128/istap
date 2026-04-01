import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'İşTap — Azərbaycanda İş Axtarışı',
    template: '%s | İşTap',
  },
  description:
    'Azərbaycanda iş axtarışı üçün etibarlı platforma. IT, mühəndislik, maliyyə, satış və daha çox sahələrdə aktual vakansiyalar.',
  keywords: ['iş', 'vakansiya', 'azerbaijan jobs', 'işaxtarışı', 'bakı iş', 'azərbaycan vakansiya'],
  openGraph: {
    title: 'İşTap — Azərbaycanda İş Axtarışı',
    description: 'Azərbaycanda ən böyük iş elanları platforması.',
    type: 'website',
    locale: 'az_AZ',
    siteName: 'İşTap',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f8f9fa]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
