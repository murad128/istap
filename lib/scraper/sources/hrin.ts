import { BaseScraper, ScrapedJob } from '../base'
import { cleanText, parseDate, normalizeLocation, extractSalary } from '../utils'

export class HrinAzScraper extends BaseScraper {
  readonly sourceName = 'hrin.az'
  readonly baseUrl = 'https://hrin.az'
  protected maxPages = 3

  async scrape(): Promise<ScrapedJob[]> {
    const jobs: ScrapedJob[] = []

    for (let page = 1; page <= this.maxPages; page++) {
      try {
        const url = page === 1
          ? `${this.baseUrl}/vacancy`
          : `${this.baseUrl}/vacancy?page=${page}`

        const html = await this.fetchWithRetry(url)
        const $ = this.load(html)

        let found = 0

        $('[class*="vacancy"],[class*="job"],[class*="position"],.card,.listing').each((_, el) => {
          const $el = $(el)

          // Skip nav/header elements
          if ($el.parents('nav,header,footer').length > 0) return

          const titleEl = $el.find('h2,h3,h4,.title,[class*="title"],[class*="name"]').first()
          const titleAz = cleanText(titleEl.text())
          if (!titleAz || titleAz.length < 2 || titleAz.length > 200) return

          const linkEl = $el.find('a').first()
          const linkHref = linkEl.attr('href') || ''
          if (!linkHref || linkHref === '#') return

          const sourceUrl = linkHref.startsWith('http') ? linkHref : `${this.baseUrl}${linkHref}`

          const company = cleanText(
            $el.find('[class*="company"],[class*="employer"],[class*="organization"]').first().text()
          )
          const location = normalizeLocation(
            $el.find('[class*="location"],[class*="city"],[class*="region"]').first().text()
          )
          const salaryText = $el.find('[class*="salary"],[class*="wage"],[class*="pay"]').first().text()
          const salary = extractSalary(salaryText)
          const dateText = $el.find('time,[class*="date"],[class*="time"]').first().text()
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
        console.error(`[hrin.az] Page ${page} error:`, err)
        break
      }
    }

    return jobs
  }
}
