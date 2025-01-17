
FROM node:alpine

WORKDIR '/client'

COPY ./package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]

# FROM nginx:alpine
# COPY --from=builder /app/build /usr/share/nginx/html
# COPY ./client/nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80