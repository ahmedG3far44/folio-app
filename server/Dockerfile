
FROM node:18-alpine

WORKDIR /server


COPY package*.json ./
COPY prisma ./prisma/


RUN npm install
RUN npx prisma generate


COPY . .


EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]