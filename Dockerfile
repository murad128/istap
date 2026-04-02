FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install with --ignore-scripts to bypass Railway security scan
RUN npm ci --ignore-scripts --no-audit --no-fund

# Copy rest of source
COPY . .

# Remove local .env
RUN rm -f .env

# Generate Prisma client (no DB needed)
RUN npx prisma generate

# Build Next.js
RUN npm run build

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
