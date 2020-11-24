FROM node:12.18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn build

FROM nginx
EXPOSE 80

COPY --from=builder /app/build /usr/share/nginx/html