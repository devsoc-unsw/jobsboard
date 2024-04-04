## Install postgresql

```
brew install  postgresql@15
```

## Start postgresql

```
brew services start postgresql@15
OUTPUT: ==> Successfully started `postgresql@15` (label: homebrew.mxcl.postgresql@15)
```

## Create the db

```
createdb postgres   
```

## Check

```
psql postgres
```

Output should look something like this, it's key that they is a db with name postgres

```
➜  backend git:(dev) psql postgres
psql (14.9 (Homebrew), server 15.6 (Homebrew))
WARNING: psql major version 14, server major version 15.
         Some psql features might not work.
Type "help" for help.

postgres=# \l
                                       List of databases
   Name    |      Owner      | Encoding | Collate | Ctype |          Access privileges          
-----------+-----------------+----------+---------+-------+-------------------------------------
 postgres  | flynnlambrechts | UTF8     | C       | C     | 
 template0 | flynnlambrechts | UTF8     | C       | C     | =c/flynnlambrechts                 +
           |                 |          |         |       | flynnlambrechts=CTc/flynnlambrechts
 template1 | flynnlambrechts | UTF8     | C       | C     | =c/flynnlambrechts                 +
           |                 |          |         |       | flynnlambrechts=CTc/flynnlambrechts
(3 rows)

postgres=# 

```

## Create a super user with name postgres

```
postgres=# CREATE ROLE postgres WITH SUPERUSER LOGIN PASSWORD '<your admin login password>';
CREATE ROLE
postgres=# \du
postgres=# \du
                                      List of roles
    Role name    |                         Attributes                         | Member of 
-----------------+------------------------------------------------------------+-----------
 flynnlambrechts | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
 postgres        | Superuser                                                  | {}

postgres=# \q
```

## Start the backend

```
yarn serve
```

Should see something like this

```
yarn run v1.22.22
$ nodemon -w ./src yarn run watch
[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts
[nodemon] starting `ts-node ./src/index.ts yarn run watch`
2024-04-04 23:30:22 [info] [LOGGER] LOGGER INITIALISED

(node:92084) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
2024-04-04 23:30:22 [info] [DEV] SEEDING DATABASE
2024-04-04 23:30:22 [info] [DEV] Clearing all tables.
2024-04-04 23:30:22 [info] [DEV] FINISHED SEEDING
2024-04-04 23:30:22 [info] [INDEX] SERVER STARTED AT PORT=8080
2024-04-04 23:34:26 [info] [STUDENT] Attempting to get featured jobs
2024-04-04 23:34:26 [info] [MIDDLEWARE] GET 304 - /featured-jobs
2024-04-04 23:34:26 [info] [STUDENT] Attempting to get featured jobs
2024-04-04 23:34:26 [info] [MIDDLEWARE] GET 304 - /featured-jobs
2024-04-04 23:34:28 [info] [STUDENT] Attempting to get featured jobs
2024-04-04 23:34:28 [info] [MIDDLEWARE] GET 304 - /featured-jobs
2024-04-04 23:34:28 [info] [STUDENT] Attempting to get featured jobs
2024-04-04 23:34:28 [info] [MIDDLEWARE] GET 304 - /featured-jobs
2024-04-04 23:34:31 [info] [AUTH] Successfully authenticated STUDENT=z5360922
2024-04-04 23:34:31 [info] [AUTH] Creating new student for STUDENT=z5360922
2024-04-04 23:34:31 [info] [STUDENT] Creating new student record with profile for STUDENT=z5360922
2024-04-04 23:34:31 [info] [MIDDLEWARE] POST 200 - /authenticate/student
2024-04-04 23:34:32 [info] [STUDENT] STUDENT=z5360922 getting paginated jobs with OFFSET=0
2024-04-04 23:34:32 [info] [MIDDLEWARE] GET 200 - /jobs/0
2024-04-04 23:34:32 [info] [AUTH] Successfully authenticated STUDENT=z5360922
2024-04-04 23:34:32 [info] [MIDDLEWARE] POST 200 - /authenticate/student
2024-04-04 23:34:32 [info] [STUDENT] STUDENT=z5360922 getting paginated jobs with OFFSET=0
2024-04-04 23:34:32 [info] [MIDDLEWARE] GET 200 - /jobs/0
2024-04-04 23:34:32 [info] [STUDENT] STUDENT=z5360922 getting paginated jobs with OFFSET=0
2024-04-04 23:34:32 [info] [MIDDLEWARE] GET 304 - /jobs/0
```

## Check working

Navigate to [localhost:8080/docs/](http://localhost:8080/docs/) to see backend running
Start the frontend and check to see if jobs are present on login
