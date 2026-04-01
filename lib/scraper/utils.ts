import { createHash } from 'crypto'

export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
]

export function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

export function cleanText(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\t+/g, ' ')
    .trim()
}

export function parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null

  const clean = dateStr.trim()

  // Try direct ISO parse
  const direct = new Date(clean)
  if (!isNaN(direct.getTime())) return direct

  // Azerbaijan date formats
  const azMonths: Record<string, number> = {
    yanvar: 0, fevral: 1, mart: 2, aprel: 3, may: 4, iyun: 5,
    iyul: 6, avqust: 7, sentyabr: 8, oktyabr: 9, noyabr: 10, dekabr: 11,
    // Abbreviated
    yan: 0, fev: 1, mar: 2, apr: 3, iyn: 5, iyl: 6, avq: 7, sen: 8, okt: 9, noy: 10, dek: 11,
  }

  const ruMonths: Record<string, number> = {
    января: 0, февраля: 1, марта: 2, апреля: 3, мая: 4, июня: 5,
    июля: 6, августа: 7, сентября: 8, октября: 9, ноября: 10, декабря: 11,
    янв: 0, фев: 1, мар: 2, апр: 3, май: 4, июн: 5, июл: 6, авг: 7, сен: 8, окт: 9, ноя: 10, дек: 11,
  }

  // "25 mart 2024" or "25 марта 2024"
  const monthMap = { ...azMonths, ...ruMonths }
  const longDateMatch = clean.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/)
  if (longDateMatch) {
    const [, day, monthStr, year] = longDateMatch
    const month = monthMap[monthStr.toLowerCase()]
    if (month !== undefined) {
      return new Date(Number(year), month, Number(day))
    }
  }

  // "DD.MM.YYYY"
  const ddmmyyyy = clean.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (ddmmyyyy) {
    const [, d, m, y] = ddmmyyyy
    return new Date(Number(y), Number(m) - 1, Number(d))
  }

  // Relative dates
  const now = new Date()
  if (/bu gün|today|сегодня/i.test(clean)) return now
  if (/dünən|yesterday|вчера/i.test(clean)) {
    const d = new Date(now)
    d.setDate(d.getDate() - 1)
    return d
  }

  const daysAgoMatch = clean.match(/(\d+)\s*(gün|day|день|дней)/i)
  if (daysAgoMatch) {
    const d = new Date(now)
    d.setDate(d.getDate() - Number(daysAgoMatch[1]))
    return d
  }

  return null
}

export function normalizeLocation(location: string | null | undefined): string {
  if (!location) return 'Bakı'

  const l = location.trim()

  const locationMap: Record<string, string> = {
    baku: 'Bakı',
    'bakı': 'Bakı',
    baki: 'Bakı',
    баку: 'Bakı',
    sumqayit: 'Sumqayıt',
    sumqayıt: 'Sumqayıt',
    сумгаит: 'Sumqayıt',
    ganca: 'Gəncə',
    gəncə: 'Gəncə',
    gence: 'Gəncə',
    гянджа: 'Gəncə',
    mingacevir: 'Mingəçevir',
    mingəçevir: 'Mingəçevir',
    naxcivan: 'Naxçıvan',
    naxçıvan: 'Naxçıvan',
    lənkəran: 'Lənkəran',
    lankaran: 'Lənkəran',
    quba: 'Quba',
    şirvan: 'Şirvan',
    shirvan: 'Şirvan',
    remote: 'Remote',
    uzaqdan: 'Remote',
    удалённо: 'Remote',
    online: 'Remote',
  }

  const normalized = locationMap[l.toLowerCase()]
  if (normalized) return normalized

  // If it contains Bakı variants
  if (/bakı|baku|баку/i.test(l)) return 'Bakı'

  // Return cleaned original
  return l.replace(/,.*$/, '').trim() || 'Bakı'
}

export function generateHash(content: string): string {
  return createHash('md5').update(content).digest('hex')
}

export function extractSalary(text: string | null | undefined): string | null {
  if (!text) return null

  // Match patterns like "1000-2000 AZN", "2000 AZN", "$1500", "1500-2000"
  const patterns = [
    /(\d[\d\s,]*)-(\d[\d\s,]*)\s*(AZN|USD|EUR|₼|\$|€)/i,
    /(\d[\d\s,]*)\s*(AZN|USD|EUR|₼|\$|€)/i,
    /(AZN|USD|EUR|₼|\$|€)\s*(\d[\d\s,]*)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) return match[0].trim()
  }

  if (/razılaşma|müzakirə|negotiable|по договоренности/i.test(text)) {
    return 'Razılaşma ilə'
  }

  return null
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
