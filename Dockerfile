FROM node:20-slim

RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install --prefer-offline

COPY . .
RUN rm -f .env

RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["./node_modules/.bin/next"]
CMD ["start", "-H", "0.0.0.0"]
