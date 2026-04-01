FROM node:20-alpine

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install --prefer-offline

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV DATABASE_URL=file:./prisma/prod.db

CMD npx prisma db push && node -e "try{require('./prisma/seed')}catch(e){}" 2>/dev/null || true && npm start
