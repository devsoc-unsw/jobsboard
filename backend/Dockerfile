FROM node:latest as builder

WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile
COPY "./" "/app/"
RUN yarn build

FROM node:slim
WORKDIR /app
COPY --from=builder "/app/dist/" "/app/dist/"
COPY --from=builder "/app/node_modules/" "/app/node_modules/"
COPY --from=builder "/app/package.json" "/app/package.json"

EXPOSE 8080

CMD node ./dist/index.js
