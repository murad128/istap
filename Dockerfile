FROM node:20-slim

RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install --prefer-offline

COPY . .

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/prisma/prod.db
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npm start"]
