FROM node:20-alpine

RUN apk add --no-cache libc6-compat
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
