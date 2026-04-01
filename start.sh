#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "🗄️ Setting up database..."
npx prisma generate
npx prisma db push

echo "🌱 Seeding database..."
npx tsx prisma/seed.ts

echo "🚀 Starting dev server..."
npm run dev
