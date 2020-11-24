## Docker compose
- Separate CLI that gets installed along with Docker
- Used to startup multiple Docker containers at the same time
- Automate some of the long-winded arguments we were passing to `docker run`

**services**: containers

Commands

```
docker run image = docker-compose up

docker build . & docker run image = docker-compose up build
```

--detach
docker-compose up -d