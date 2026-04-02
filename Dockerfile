FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --prefer-offline --no-audit --no-fund

COPY . .
RUN rm -f .env

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
