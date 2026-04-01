const { execSync } = require('child_process');
const { createServer } = require('http');

// Run prisma db push
try {
  console.log('Running prisma db push...');
  execSync('node node_modules/.bin/prisma db push', { stdio: 'inherit' });
  console.log('DB ready!');
} catch (e) {
  console.log('Prisma push warning:', e.message);
}

// Start Next.js
console.log('Starting Next.js...');
const port = parseInt(process.env.PORT || '3000', 10);
process.env.PORT = String(port);

// Spawn next start
const { spawn } = require('child_process');
const next = spawn('node', ['node_modules/.bin/next', 'start', '-p', String(port), '-H', '0.0.0.0'], {
  stdio: 'inherit',
  env: process.env,
});

next.on('exit', (code) => {
  process.exit(code);
});
