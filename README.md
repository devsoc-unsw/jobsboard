# Build

Now uses `docker-compose` and `docker`, meaning you need to run:

```
docker-compose build
```

to build the backend and frontend images.

# Run (and build the frontend)

Use `docker-compose` to run the backend and build the frontend, which gets placed into `/frontend/dist`:

```
docker-compose up
```

# Stop

```
docker-compose down
```

[API docs](http://localhost:8080/docs/)
