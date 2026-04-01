'use client';
import { useEffect, useState } from 'react';

interface ViewTrackerProps {
  jobId: string;
  initialCount: number;
  lang?: string;
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem('istap_sid');
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('istap_sid', sid);
  }
  return sid;
}

export default function ViewTracker({ jobId, initialCount, lang = 'az' }: ViewTrackerProps) {
  const [viewCount, setViewCount] = useState(initialCount);

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;

    fetch('/api/jobs/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, sessionId }),
    })
      .then(r => r.json())
      .then(d => { if (d.viewCount) setViewCount(d.viewCount); })
      .catch(() => {});
  }, [jobId]);

  const label = lang === 'en'
    ? `Viewed ${viewCount} times`
    : lang === 'ru'
    ? `Просмотров: ${viewCount}`
    : `Baxış sayı: ${viewCount}`;

  return (
    <span className="inline-flex items-center gap-1 text-sm text-gray-400">
      👁 {label}
    </span>
  );
}
