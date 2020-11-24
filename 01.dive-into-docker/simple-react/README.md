# React Project with Docker

- Create `Dockerfile`
  We will create Dockerfile for each purpose:
  - Dockerfile: production
  - Dockerfile.dev: development
  - Dockerfile.test: test
- Build by environment with `-f` tag (file)
  - `docker build -f Dockerfile.dev .`: build for development
- Run image by id to start server react
  ex: `docker run -p 3000:3000 -it 6cdc40bb7919`

## Docker volumes
- Run docker command with reference node_module from Docker container
  ```s
  $ docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app -it 6cdc40bb7919 #id image
  ```
  With this command, when you change the code in your app locally, that will update on container too. 

  This is a long command line --> to solve this problem, we will use docker-compose.

## Docker compose