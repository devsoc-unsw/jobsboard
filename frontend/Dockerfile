FROM node:latest

RUN yarn global add @vue/cli-service-global

VOLUME ["/app"]

WORKDIR /app

CMD yarn install && yarn build
