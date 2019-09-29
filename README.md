1. start mysql server, create a database

2. go to backend, create a .env file
```
SERVER_PORT=8081
NODE_ENV=development
MYSQL_DATABASE=
DATABASE_HOST=localhost
MYSQL_PASSWD=
MYSQL_USER=
```

3. run
`yarn install`
`yarn build`
`yarn serve`

4. go to frontend folder, run
`yarn install`
`yarn serve`