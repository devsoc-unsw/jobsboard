FROM node:20.2-alpine as builder
WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile
COPY ./ .

RUN yarn build

FROM node:20.2-alpine as runner
ENV NODE_ENV production
WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile

COPY --from=builder "/app/dist/" "/app/dist/"

EXPOSE 8080

CMD node ./dist/index.js
