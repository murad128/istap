export async function register() {
  // Scheduler disabled - enable via ENABLE_SCHEDULER=true
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.ENABLE_SCHEDULER === 'true') {
    const { startScheduler } = await import('./lib/scheduler')
    startScheduler()
  }
}
