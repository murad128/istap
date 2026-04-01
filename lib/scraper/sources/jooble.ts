import { BaseScraper, ScrapedJob } from '../base'
import { cleanText, parseDate, normalizeLocation, extractSalary } from '../utils'

export class JoobleAzScraper extends BaseScraper {
  readonly sourceName = 'jooble.az'
  readonly baseUrl = 'https://az.jooble.org'
  protected maxPages = 3

  async scrape(): Promise<ScrapedJob[]> {
    const jobs: ScrapedJob[] = []

    for (let page = 1; page <= this.maxPages; page++) {
      try {
        const url = page === 1
          ? `${this.baseUrl}/işaxtarışı`
          : `${this.baseUrl}/işaxtarışı?p=${page}`

        const html = await this.fetchWithRetry(url)
        const $ = this.load(html)

        let found = 0

        // Jooble uses article tags with specific data attributes
        $('article,[role="article"],[data-test-name*="job"],.job-item').each((_, el) => {
          const $el = $(el)

          const titleEl = $el.find('h2,h3,[data-test-name*="title"],.title').first()
          const titleAz = cleanText(titleEl.text())
          if (!titleAz || titleAz.length < 2) return

          const linkHref = $el.find('a').first().attr('href') || titleEl.closest('a').attr('href') || ''
          if (!linkHref) return

          const sourceUrl = linkHref.startsWith('http') ? linkHref : `${this.baseUrl}${linkHref}`

          const company = cleanText($el.find('[data-test-name*="company"],.company').first().text())
          const location = normalizeLocation($el.find('[data-test-name*="location"],.location').first().text())
          const salaryText = $el.find('[data-test-name*="salary"],.salary').first().text()
          const salary = extractSalary(salaryText)
          const dateText = $el.find('time,[data-test-name*="date"]').first().attr('datetime') ||
            $el.find('time,[data-test-name*="date"]').first().text()
          const publishDate = parseDate(dateText)

          const idMatch = sourceUrl.match(/[?&]id=(\d+)/) || sourceUrl.match(/\/(\d+)(?:\/|$|\?)/)
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
        console.error(`[jooble.az] Page ${page} error:`, err)
        break
      }
    }

    return jobs
  }
}
