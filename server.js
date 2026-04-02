const { execSync } = require('child_process');
const { spawn } = require('child_process');

const port = parseInt(process.env.PORT || '3000', 10);

// Prisma db push at runtime
try {
  console.log('[server] Running prisma db push...');
  execSync('npx prisma db push --skip-generate', {
    stdio: 'inherit',
    env: process.env,
  });
  console.log('[server] DB synced.');
} catch (e) {
  console.error('[server] Prisma warning (continuing):', e.message);
}

// Start Next.js
console.log(`[server] Starting Next.js on port ${port}...`);

const nextProcess = spawn(
  'node',
  ['node_modules/.bin/next', 'start', '-p', String(port), '-H', '0.0.0.0'],
  {
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) },
  }
);

nextProcess.on('close', (code) => {
  console.log(`[server] Next.js exited with code ${code}`);
  process.exit(code ?? 1);
});

nextProcess.on('error', (err) => {
  console.error('[server] Failed to start Next.js:', err);
  process.exit(1);
});
