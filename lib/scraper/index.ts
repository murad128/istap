import prisma from '../db'
import { categorize } from '../categorizer'
import { generateHash } from './utils'
import { BossAzScraper } from './sources/boss'
import { JobSearchAzScraper } from './sources/jobsearch'
import { HelloJobAzScraper } from './sources/hellojob'
import { SmartJobAzScraper } from './sources/smartjob'
import { EJobAzScraper } from './sources/ejob'
import { IseqebulAzScraper } from './sources/iseqebul'
import { JoobleAzScraper } from './sources/jooble'
import { HrinAzScraper } from './sources/hrin'
import type { ScrapedJob } from './base'

export interface ImportResult {
  sourceName: string
  status: 'success' | 'error'
  jobsFound: number
  jobsAdded: number
  jobsSkipped: number
  error?: string
}

const scrapers = [
  new BossAzScraper(),
  new JobSearchAzScraper(),
  new HelloJobAzScraper(),
  new SmartJobAzScraper(),
  new EJobAzScraper(),
  new IseqebulAzScraper(),
  new JoobleAzScraper(),
  new HrinAzScraper(),
]

async function saveJobs(jobs: ScrapedJob[]): Promise<{ added: number; skipped: number }> {
  let added = 0
  let skipped = 0

  for (const job of jobs) {
    try {
      // Generate content hash for deduplication
      const contentHash = generateHash(
        `${job.titleAz.toLowerCase()}${job.company.toLowerCase()}${job.sourceUrl}`
      )

      // Check if exists by URL or hash
      const existing = await prisma.job.findFirst({
        where: {
          OR: [
            { sourceUrl: job.sourceUrl },
            { contentHash },
          ],
        },
        select: { id: true },
      })

      if (existing) {
        skipped++
        continue
      }

      // Auto-categorize if not set
      const categorySlug = job.categorySlug || categorize(job.titleAz, job.descriptionAz)

      await prisma.job.create({
        data: {
          sourceId: job.sourceId,
          sourceName: job.sourceName,
          sourceUrl: job.sourceUrl,
          titleAz: job.titleAz,
          titleEn: job.titleEn,
          titleRu: job.titleRu,
          company: job.company,
          location: job.location || 'Bakı',
          salary: job.salary,
          jobType: job.jobType,
          workMode: job.workMode,
          experienceLevel: job.experienceLevel,
          categorySlug,
          descriptionAz: job.descriptionAz,
          descriptionEn: job.descriptionEn,
          descriptionRu: job.descriptionRu,
          requirementsAz: job.requirementsAz,
          requirementsEn: job.requirementsEn,
          requirementsRu: job.requirementsRu,
          contentHash,
          publishDate: job.publishDate,
          expiryDate: job.expiryDate,
          status: 'active',
        },
      })

      added++
    } catch (err: unknown) {
      // Skip duplicate key errors silently
      if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
        skipped++
      } else {
        console.error('[scraper] Failed to save job:', job.sourceUrl, err)
        skipped++
      }
    }
  }

  return { added, skipped }
}

export async function runScraper(sourceName?: string): Promise<ImportResult[]> {
  const results: ImportResult[] = []

  const targetScrapers = sourceName
    ? scrapers.filter((s) => s.sourceName === sourceName)
    : scrapers

  for (const scraper of targetScrapers) {
    console.log(`[scraper] Starting ${scraper.sourceName}...`)

    let status: 'success' | 'error' = 'success'
    let jobsFound = 0
    let jobsAdded = 0
    let jobsSkipped = 0
    let error: string | undefined

    try {
      const jobs = await scraper.scrape()
      jobsFound = jobs.length
      console.log(`[scraper] ${scraper.sourceName}: found ${jobsFound} jobs`)

      const { added, skipped } = await saveJobs(jobs)
      jobsAdded = added
      jobsSkipped = skipped

      // Update source record
      await prisma.source.upsert({
        where: { name: scraper.sourceName },
        update: {
          lastRun: new Date(),
          jobsFound,
          active: true,
        },
        create: {
          name: scraper.sourceName,
          url: scraper.baseUrl,
          lastRun: new Date(),
          jobsFound,
          active: true,
        },
      })
    } catch (err: unknown) {
      status = 'error'
      error = err instanceof Error ? err.message : String(err)
      console.error(`[scraper] ${scraper.sourceName} FAILED:`, error)
    }

    // Log result to DB
    await prisma.importLog.create({
      data: {
        sourceName: scraper.sourceName,
        status,
        jobsFound,
        jobsAdded,
        jobsSkipped,
        error,
      },
    })

    results.push({
      sourceName: scraper.sourceName,
      status,
      jobsFound,
      jobsAdded,
      jobsSkipped,
      error,
    })

    console.log(
      `[scraper] ${scraper.sourceName}: added=${jobsAdded}, skipped=${jobsSkipped}, status=${status}`
    )
  }

  return results
}

export async function markExpiredJobs(): Promise<number> {
  const result = await prisma.job.updateMany({
    where: {
      status: 'active',
      expiryDate: {
        lt: new Date(),
      },
    },
    data: { status: 'expired' },
  })
  return result.count
}
