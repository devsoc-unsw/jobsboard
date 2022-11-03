FROM node:18.11-alpine as builder

WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile
COPY ./ .
RUN yarn build

FROM node:18.11-alpine as runner
ENV NODE_ENV development
WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile

COPY --from=builder "/app/dist/" "/app/dist/"

WORKDIR /app
COPY tsconfig.json .

EXPOSE 8080

CMD node ./dist/index.js
# CMD yarn run dev
# CMD ["yarn", "run", "dev"]
# CMD ["yarn", "run", "dev"]

# CMD ["yarn", "run", "serve"]

# ENTRYPOINT [ "yarn", "run", "dev" ]
# ENTRYPOINT [ "yarn", "run", "serve" ]


# CMD yarn dev
