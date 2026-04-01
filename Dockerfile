FROM node:20-slim

RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install --prefer-offline

COPY . .
RUN rm -f .env
RUN chmod +x start.sh

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

CMD ["/app/start.sh"]
