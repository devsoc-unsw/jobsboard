# Set up

1. start mysql server, create a database

2. go to backend folder, create a .env file

``` shell
SERVER_PORT=8081
NODE_ENV=development
MYSQL_DATABASE=
DATABASE_HOST=localhost
MYSQL_PASSWD=
MYSQL_USER=
```

3. run

``` shell
yarn install
yarn build
yarn serve
```

4. go to frontend folder, run

``` shell
yarn install
yarn serve
```

API docs: http://localhost:8081/docs/
