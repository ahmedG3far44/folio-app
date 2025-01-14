
FROM node:alpine

WORKDIR '/app/client'
COPY ./package*.json ./app/client/

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]

# FROM nginx:alpine
# COPY --from=builder /app/build /usr/share/nginx/html
# COPY ./client/nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80