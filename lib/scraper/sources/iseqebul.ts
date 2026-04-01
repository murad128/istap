import { BaseScraper, ScrapedJob } from '../base'
import { cleanText, parseDate, normalizeLocation, extractSalary } from '../utils'

export class IseqebulAzScraper extends BaseScraper {
  readonly sourceName = 'iseqebul.az'
  readonly baseUrl = 'https://iseqebul.az'
  protected maxPages = 3

  async scrape(): Promise<ScrapedJob[]> {
    const jobs: ScrapedJob[] = []

    for (let page = 1; page <= this.maxPages; page++) {
      try {
        const url = page === 1
          ? `${this.baseUrl}/vakansiyalar`
          : `${this.baseUrl}/vakansiyalar?page=${page}`

        const html = await this.fetchWithRetry(url)
        const $ = this.load(html)

        let found = 0

        $('[class*="vacancy"],[class*="job"],[class*="position"],article.card').each((_, el) => {
          const $el = $(el)

          const titleEl = $el.find('h1,h2,h3,.title,[class*="title"]').first()
          const titleAz = cleanText(titleEl.text())
          if (!titleAz || titleAz.length < 2) return

          const linkHref = $el.find('a').first().attr('href') || ''
          if (!linkHref) return

          const sourceUrl = linkHref.startsWith('http') ? linkHref : `${this.baseUrl}${linkHref}`

          const company = cleanText($el.find('[class*="company"],[class*="employer"],[class*="organization"]').first().text())
          const location = normalizeLocation($el.find('[class*="location"],[class*="city"],[class*="address"]').first().text())
          const salaryText = $el.find('[class*="salary"],[class*="wage"]').first().text()
          const salary = extractSalary(salaryText)
          const dateText = $el.find('time,[class*="date"]').first().text()
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
          found++
        })

        if (found === 0) break
        await this.randomDelay()
      } catch (err) {
        console.error(`[iseqebul.az] Page ${page} error:`, err)
        break
      }
    }

    return jobs
  }
}
