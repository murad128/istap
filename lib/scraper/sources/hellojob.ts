import { BaseScraper, ScrapedJob } from '../base'
import { cleanText, parseDate, normalizeLocation, extractSalary } from '../utils'

export class HelloJobAzScraper extends BaseScraper {
  readonly sourceName = 'hellojob.az'
  readonly baseUrl = 'https://hellojob.az'
  protected maxPages = 3

  async scrape(): Promise<ScrapedJob[]> {
    const jobs: ScrapedJob[] = []

    for (let page = 1; page <= this.maxPages; page++) {
      try {
        const url = page === 1
          ? `${this.baseUrl}/vacancies`
          : `${this.baseUrl}/vacancies?page=${page}`

        const html = await this.fetchWithRetry(url)
        const $ = this.load(html)

        const cards = $('.vacancy,.job,.card,.listing-item,[class*="job"],[class*="vacancy"]')

        if (cards.length === 0) break

        cards.each((_, el) => {
          const $el = $(el)

          const titleEl = $el.find('h1,h2,h3,.title,[class*="title"]').first()
          const titleAz = cleanText(titleEl.text())
          if (!titleAz || titleAz.length < 2) return

          const link = $el.find('a').first()
          const href = link.attr('href') || ''
          if (!href) return

          const sourceUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`

          const company = cleanText($el.find('.company,[class*="company"],[class*="employer"]').first().text())
          const location = normalizeLocation($el.find('.location,[class*="location"],[class*="city"]').first().text())
          const salaryText = $el.find('.salary,[class*="salary"]').first().text()
          const salary = extractSalary(salaryText)
          const dateText = $el.find('time,.date,[class*="date"]').first().attr('datetime') ||
            $el.find('time,.date,[class*="date"]').first().text()
          const publishDate = parseDate(dateText)

          const idMatch = sourceUrl.match(/\/(\d+)(?:\/|$|\?)/)
          const sourceId = idMatch ? idMatch[1] : undefined

          jobs.push({
            sourceId,
            sourceName: this.sourceName,
            sourceUrl,
            titleAz,
            company: company || 'Şirkət',
            location: location || 'Bakı',
            salary: salary || undefined,
            publishDate,
          })
        })

        await this.randomDelay()
      } catch (err) {
        console.error(`[hellojob.az] Page ${page} error:`, err)
        break
      }
    }

    return jobs
  }
}
