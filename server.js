const { spawn } = require('child_process');
const { execSync } = require('child_process');

const port = parseInt(process.env.PORT || '3000', 10);

console.log(`[server] Starting on port ${port}...`);

// Prisma db push
try {
  execSync('npx prisma db push --skip-generate', { stdio: 'pipe', env: process.env });
  console.log('[server] DB synced.');
} catch (e) {
  console.log('[server] DB sync skipped.');
}

// Seed if DB is empty
try {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  prisma.job.count().then(count => {
    if (count === 0) {
      console.log('[server] DB empty, seeding...');
      execSync('npx tsx prisma/seed.ts', { stdio: 'pipe', env: process.env });
      console.log('[server] Seeded.');
    }
    prisma.$disconnect();
  }).catch(() => {});
} catch (e) {
  console.log('[server] Seed skipped.');
}

// Start Next.js
const next = spawn('node', ['node_modules/.bin/next', 'start', '-p', String(port), '-H', '0.0.0.0'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: String(port) },
});

next.on('close', (code) => process.exit(code ?? 1));
next.on('error', (err) => { console.error(err); process.exit(1); });
