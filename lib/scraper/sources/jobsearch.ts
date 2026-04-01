import { BaseScraper, ScrapedJob } from '../base'
import { cleanText, parseDate, normalizeLocation, extractSalary } from '../utils'

export class JobSearchAzScraper extends BaseScraper {
  readonly sourceName = 'jobsearch.az'
  readonly baseUrl = 'https://jobsearch.az'
  protected maxPages = 3

  async scrape(): Promise<ScrapedJob[]> {
    const jobs: ScrapedJob[] = []

    for (let page = 1; page <= this.maxPages; page++) {
      try {
        const url = `${this.baseUrl}/vacancies?page=${page}`
        const html = await this.fetchWithRetry(url)
        const $ = this.load(html)
        const pageJobs: ScrapedJob[] = []

        // Try multiple selectors
        const cards = $('article.vacancy, .vacancy-card, .job-listing, .vacancy-item, [class*="vacancy"]')

        cards.each((_, el) => {
          const $el = $(el)

          const titleEl = $el.find('h2,h3,.vacancy-title,.job-title,a.title').first()
          const titleAz = cleanText(titleEl.text())
          if (!titleAz || titleAz.length < 2) return

          const linkEl = $el.find('a').first()
          const href = linkEl.attr('href') || titleEl.closest('a').attr('href') || ''
          if (!href) return

          const sourceUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`

          const company = cleanText(
            $el.find('.company,.employer,.vacancy-company').first().text()
          )
          const location = normalizeLocation(
            $el.find('.location,.city,.vacancy-location').first().text()
          )
          const salaryText = $el.find('.salary,.vacancy-salary').first().text()
          const salary = extractSalary(salaryText)
          const dateText = $el.find('.date,time,.posted-date').first().text()
          const publishDate = parseDate(dateText)

          const idMatch = sourceUrl.match(/\/(\d+)(?:\/|$|\?)/)
          const sourceId = idMatch ? idMatch[1] : undefined

          pageJobs.push({
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

        if (pageJobs.length === 0) break

        jobs.push(...pageJobs)
        await this.randomDelay()
      } catch (err) {
        console.error(`[jobsearch.az] Page ${page} error:`, err)
        break
      }
    }

    return jobs
  }
}
