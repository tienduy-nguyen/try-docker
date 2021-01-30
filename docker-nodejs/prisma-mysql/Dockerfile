FROM node:lts-alpine AS base
WORKDIR /usr/src/app

RUN apk update \ 
  && apk add bash \
  && rm -rf /var/cache/apk/*

COPY package*.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile
RUN yarn prisma:generate


COPY . . 

EXPOSE 80
CMD [ "yarn", "start:dev" ]
