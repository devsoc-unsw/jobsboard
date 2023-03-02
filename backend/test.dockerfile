FROM node:19.4-alpine

WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile
COPY "./" "/app/"
RUN yarn build

CMD sleep 10 && yarn travis:test