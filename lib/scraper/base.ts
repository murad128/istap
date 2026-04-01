import axios, { AxiosRequestConfig } from 'axios'
import * as cheerio from 'cheerio'
import { getRandomUserAgent, delay } from './utils'

export interface ScrapedJob {
  sourceId?: string
  sourceName: string
  sourceUrl: string
  titleAz: string
  titleEn?: string
  titleRu?: string
  company: string
  location?: string
  salary?: string
  jobType?: string
  workMode?: string
  experienceLevel?: string
  categorySlug?: string
  descriptionAz?: string
  descriptionEn?: string
  descriptionRu?: string
  requirementsAz?: string
  requirementsEn?: string
  requirementsRu?: string
  publishDate?: Date | null
  expiryDate?: Date | null
}

export abstract class BaseScraper {
  abstract readonly sourceName: string
  abstract readonly baseUrl: string
  protected maxPages: number = 3
  protected delayMs: number = 1500

  protected async fetchWithRetry(
    url: string,
    options: AxiosRequestConfig = {},
    retries = 3
  ): Promise<string> {
    const config: AxiosRequestConfig = {
      url,
      method: 'GET',
      timeout: 15000,
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'az-AZ,az;q=0.9,en;q=0.8,ru;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...options.headers,
      },
      ...options,
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios(config)
        return response.data as string
      } catch (err: unknown) {
        const isLastAttempt = attempt === retries
        if (isLastAttempt) throw err

        const backoff = attempt * 2000
        console.warn(`[${this.sourceName}] Retry ${attempt}/${retries} for ${url}, waiting ${backoff}ms`)
        await delay(backoff)
      }
    }

    throw new Error(`Failed to fetch ${url} after ${retries} retries`)
  }

  protected randomDelay(): Promise<void> {
    const ms = this.delayMs + Math.floor(Math.random() * 1000)
    return delay(ms)
  }

  protected load(html: string) {
    return cheerio.load(html)
  }

  abstract scrape(): Promise<ScrapedJob[]>
}
