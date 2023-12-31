FROM node:21.0-alpine

WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile
COPY "./" "/app/"
RUN yarn build

CMD sleep 15 && yarn travis:test
