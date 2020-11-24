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

  Check more about [docker volumes - vi](https://daothaison.me/docker-3-tim-hieu-ve-docker-phan-3-daothaison1560923507)
  

## Docker compose
-Create `docker-compose.yml`
  ```yml
  version: '3.8'
  services:
    web:
      build:
        context: .
        dockerfile: Dockerfile.dev #specify Dockerfile to run
      ports:
        - '3000:3000'
      volumes:
        - /app/node_modules #It means do not try map a folder up against app/node_modules
        - .:/app #map outside of container to the folder inside of container


  ```

- Build and run
  ```s
  $ docker-compose up
  ```
**Note**: When we use docker-compose, do we need copy in Dockerfile? yes.

## Executing test
- Get image id
- Command
  ```s
  $ docker run -it b7f2b3c406ea yarn test
  ```