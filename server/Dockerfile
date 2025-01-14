FROM node:22.11.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm ci

RUN npx prisma generate 

RUN npx prisma db push

EXPOSE 4000

CMD ["node", "src/index.js"]

# CMD ["pm2", "start", "--name express-server"]