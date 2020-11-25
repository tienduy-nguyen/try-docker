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
- Live updating test
  - Get id container running: `docker ps`
  - Execute directly command test
  ```s
  $ docker exec -it b7f2b3c406ea yarn test
  ```
- Docker compose for running tests
  - We will create the new service `tests` in `docker-compose.yml` file
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
      tests:
        build:
          context: .
          dockerfile: Dockerfile.dev
        volumes:
          - app/node_modules
          - .:/app
        command: ['yarn', 'test']

    ```
  - Build & Run command
    ```s
    $ docker-compose up --build
    ```
    When we build with docker-compose, all the services declared will be run. In this app: service **web** and service **tests** will be run with command `docker-compose up --build`

## Work with nginx
- Build phase process
  - Use node:alpine
  - Copy the package.json file
  - Install dependencies
  - Run `yarn build`
- Run phase
  - Use nginx
  - Copy over the result of `yarn build`
  - Start nginx
- Create **Dockerfile**
  ```yml
  FROM node:12.18-alpine

  WORKDIR /app

  COPY package*.json ./

  RUN yarn build

  # Image of nginx
  FROM nginx
  EXPOSE 80

  COPY --from=builder /app/build /usr/share/nginx/html
  # Check image iginx for more details
  # https://hub.docker.com/_/nginx
  ```
- Build and run
  ```s
  $ docker build .
  $ docker run -p 8080:80 <id image>

  ```
## Travis CI setup in GitHub repo
### Create account travis-ci
- Sign-in  [travis-ci.org](https://travis-ci.org) with your account Github
- Go to [travis-ci.org/account/repositories](https://travis-ci.org/account/repositories) and check run for the repository what we need to deploy automatically with travis-ci
### Configuration
We will use a Travis YML file Configuration: `travis.yml`

This file:
- Tell Travis wee need a copy of docker running
- Build our image using Dockerfile.dev
- Tell Travis how to run our test suite
- Tell Travis how to deploy our code to AWS

```yml
# travis.yml
sudo: required
services: -docker

before_install:
  - docker build -t tienduynguyen/simple-docker-react -f Dockerfile.dev .
  # docker build -t <username docker>/<name  image> -f <Dockerfile>

script:
  - docker run -it tienduynguyen/simple-docker-react yarn test -- --coverage

```