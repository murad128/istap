import { NextRequest, NextResponse } from 'next/server';
import { runAllScrapers, runScraper } from '@/lib/scraper';

export async function POST(req: NextRequest) {
  const { source } = await req.json().catch(() => ({}));
  try {
    if (source) {
      await runScraper(source);
    } else {
      await runAllScrapers();
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
