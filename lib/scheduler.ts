import cron from 'node-cron'

let schedulerStarted = false

export function startScheduler() {
  if (process.env.DISABLE_SCHEDULER === 'true') {
    console.log('[scheduler] Scheduler disabled.');
    return;
  }
  if (schedulerStarted) {
    console.log('[scheduler] Already started, skipping')
    return
  }

  schedulerStarted = true
  console.log('[scheduler] Starting job scraper scheduler...')

  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('[scheduler] Running scheduled scrape...')
    try {
      const { runScraper, markExpiredJobs } = await import('./scraper/index')
      const results = await runScraper()
      const expired = await markExpiredJobs()

      const totalAdded = results.reduce((sum, r) => sum + r.jobsAdded, 0)
      const totalFound = results.reduce((sum, r) => sum + r.jobsFound, 0)
      const errors = results.filter((r) => r.status === 'error').length

      console.log(
        `[scheduler] Done: found=${totalFound}, added=${totalAdded}, expired=${expired}, errors=${errors}`
      )
    } catch (err) {
      console.error('[scheduler] Scheduled scrape failed:', err)
    }
  })

  // Also run expired job cleanup daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('[scheduler] Running daily cleanup...')
    try {
      const { markExpiredJobs } = await import('./scraper/index')
      const expired = await markExpiredJobs()
      console.log(`[scheduler] Marked ${expired} jobs as expired`)
    } catch (err) {
      console.error('[scheduler] Daily cleanup failed:', err)
    }
  })

  console.log('[scheduler] Scheduler started. Scraping every 30 minutes.')
}
