import { BaseScraper, ScrapedJob } from '../base'
import { cleanText, parseDate, normalizeLocation, extractSalary } from '../utils'

export class BossAzScraper extends BaseScraper {
  readonly sourceName = 'boss.az'
  readonly baseUrl = 'https://boss.az'
  protected maxPages = 5

  async scrape(): Promise<ScrapedJob[]> {
    const jobs: ScrapedJob[] = []

    for (let page = 1; page <= this.maxPages; page++) {
      try {
        const url = page === 1
          ? `${this.baseUrl}/vacancies`
          : `${this.baseUrl}/vacancies?page=${page}`

        const html = await this.fetchWithRetry(url)
        const $ = this.load(html)
        const pageJobs: { url: string; data: Partial<ScrapedJob> }[] = []

        // Parse vacancy list
        $('.results-i').each((_, el) => {
          const $el = $(el)

          const titleEl = $el.find('.results-i-title')
          const titleAz = cleanText(titleEl.text())
          if (!titleAz) return

          const relativeUrl = titleEl.attr('href') || $el.find('a').first().attr('href') || ''
          const sourceUrl = relativeUrl.startsWith('http')
            ? relativeUrl
            : `${this.baseUrl}${relativeUrl}`

          if (!sourceUrl || sourceUrl === this.baseUrl) return

          const company = cleanText($el.find('.results-i-company').text())
          const location = normalizeLocation($el.find('.results-i-city').text())
          const salaryText = cleanText($el.find('.results-i-salary').text())
          const salary = extractSalary(salaryText) || (salaryText || undefined)
          const dateText = cleanText($el.find('.results-i-date').text())
          const publishDate = parseDate(dateText)

          pageJobs.push({
            url: sourceUrl,
            data: { titleAz, company, location, salary, publishDate },
          })
        })

        // If no results found with that selector, try alternate
        if (pageJobs.length === 0) {
          $('[data-item="vacancy"],.vacancy-item,.job-item').each((_, el) => {
            const $el = $(el)
            const titleEl = $el.find('h3,h2,.title,.vacancy-name').first()
            const titleAz = cleanText(titleEl.text())
            if (!titleAz) return

            const linkEl = $el.find('a').first()
            const relativeUrl = linkEl.attr('href') || ''
            const sourceUrl = relativeUrl.startsWith('http')
              ? relativeUrl
              : `${this.baseUrl}${relativeUrl}`

            if (!sourceUrl || sourceUrl === this.baseUrl) return

            const company = cleanText($el.find('.company,.employer').first().text())
            const location = normalizeLocation($el.find('.location,.city').first().text())

            pageJobs.push({
              url: sourceUrl,
              data: { titleAz, company, location },
            })
          })
        }

        // Fetch details for each job
        for (const job of pageJobs.slice(0, 20)) {
          try {
            await this.randomDelay()
            const detail = await this.fetchJobDetail(job.url, job.data)
            if (detail) jobs.push(detail)
          } catch (err) {
            console.warn(`[boss.az] Failed to fetch detail: ${job.url}`, err)
            // Still add with basic info
            jobs.push({
              sourceName: this.sourceName,
              sourceUrl: job.url,
              titleAz: job.data.titleAz || 'Vakansiya',
              company: job.data.company || 'Şirkət',
              location: job.data.location || 'Bakı',
              salary: job.data.salary,
              publishDate: job.data.publishDate,
            })
          }
        }

        // Check if there's a next page
        const hasNextPage = $('a[rel="next"],.pagination-next,a:contains("Növbəti")').length > 0
        if (!hasNextPage && page > 1) break

        await this.randomDelay()
      } catch (err) {
        console.error(`[boss.az] Failed to scrape page ${page}:`, err)
        break
      }
    }

    return jobs
  }

  private async fetchJobDetail(
    url: string,
    baseData: Partial<ScrapedJob>
  ): Promise<ScrapedJob | null> {
    const html = await this.fetchWithRetry(url)
    const $ = this.load(html)

    const titleAz =
      cleanText($('.vacancy-name, h1.title, .job-title').first().text()) ||
      baseData.titleAz ||
      'Vakansiya'

    const company =
      cleanText($('.vacancy-company, .company-name, [itemprop="hiringOrganization"]').first().text()) ||
      baseData.company ||
      'Şirkət'

    const location =
      normalizeLocation($('.vacancy-location, .location, [itemprop="jobLocation"]').first().text()) ||
      baseData.location ||
      'Bakı'

    const salaryEl = $('.vacancy-salary, .salary, [itemprop="baseSalary"]').first()
    const salary = extractSalary(salaryEl.text()) || baseData.salary

    const descEl = $('.vacancy-description, .job-description, [itemprop="description"]').first()
    const descriptionAz = cleanText(descEl.text()) || undefined

    const reqEl = $('.vacancy-requirements, .requirements').first()
    const requirementsAz = cleanText(reqEl.text()) || undefined

    const dateEl = $('.vacancy-date, .date, time').first()
    const publishDate =
      parseDate(dateEl.attr('datetime') || dateEl.text()) || baseData.publishDate

    const jobTypeEl = $('.vacancy-type, .job-type').first()
    const jobType = cleanText(jobTypeEl.text()) || baseData.jobType

    // Extract source ID from URL
    const idMatch = url.match(/\/(\d+)(?:\?|$)/)
    const sourceId = idMatch ? idMatch[1] : undefined

    return {
      sourceId,
      sourceName: this.sourceName,
      sourceUrl: url,
      titleAz,
      company,
      location,
      salary,
      jobType,
      descriptionAz,
      requirementsAz,
      publishDate,
    }
  }
}
