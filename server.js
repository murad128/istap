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

// Start Next.js
const next = spawn('node', ['node_modules/.bin/next', 'start', '-p', String(port), '-H', '0.0.0.0'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: String(port) },
});

next.on('close', (code) => process.exit(code ?? 1));
next.on('error', (err) => { console.error(err); process.exit(1); });
