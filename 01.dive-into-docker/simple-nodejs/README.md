# Simple web app with Nodejs Using Docker

## Steps to follow
- Create NodeJS web app
- Create a Dockerfile
- Build image from Dockerfile
- Run image as container
- Connect to web app from a browser

## Getting started

- Create root folder of project

  ```s
  $ mkdir simple-nodejs
  $ cd simple-nodejs
  ```
- Init `package.json`
  ```s
  $ yarn init -y
  ```

  Add dependencies and scripts in this **package.json** file
  ```json
  {
    "name": "simple-nodejs",
    "version": "1.0.0",
    "main": "index.js",
    "license": "MIT",
    "scripts": {
      "start": "node index.js",
      "dev": "nodemon index.js"
    },
    "dependencies": {
      "express": "*",
      "nodemon": "*",
      "dotenv": "*",
      "mongoose": "*",
      "axios": "*"
    }
  }
  ```
- Create `index.js` file (in root project)
  Add the following code to run server nodejs with `express` framework.

  ```js
  const express = require('express');

  const app = express();

  app.get('/', (req, res) => {
    res.send('Hi there!');
  });

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  ```
- Create `Dockerfile`
  ```s
  $ touch Dockerfile
  ```

  - The first thing we need to do is define from what image we want to build from. Here is the version 12.18.1 of Nodejs from [DockerHub](https://hub.docker.com/)

  ```yml
  FROM node:12.18.1
  ```
  - Next we create a directory to hold the application code inside the image. This will be the working directory for your application.
  ```yml
  # Create app directory
  WORKDIR /app
  ```


  - This image comes with Node.js and NPM already installed so the next thing we need to do is to install your app dependencies using the npm binary. Please note that if you are using npm version 4 or earlier a package-lock.json file will not be generated.
  
  ```yml
  # Install app dependencies
  # A wildcard is used to ensure both package.json AND package-lock.json are copied
  # where available (npm@5+)
  COPY package*.json ./

  RUN npm install
  # If you are building your code for production
  # RUN npm ci --only=production
  ```
  - To bundle your app's source code inside the Docker image, use the COPY instruction:
  ```yml
  # Bundle app source
  COPY . .
  ```
  - Your app binds to port `8080` so you'll use the `EXPOSE` instruction to have it mapped by the docker daemon:
  ```yml
  EXPOSE 8080
  ```
  - Last but not least, define the command to run your app using CMD which defines your runtime. Here we will use `node index.js` to start your server as write in scripts of `package.json` file.
  ```yml
  CMD ["yarn", "dev"]
  ```


  - Your `Dockerfile` should now look like this:
  ```yml
  # Specify a base image
  FROM node:12.18.1

  # Create app directory
  WORKDIR /app

  # Install app dependencies
  # A wildcard is used to ensure both package.json AND package-lock.json are copied
  # where available (npm@5+)
  COPY package*.json ./

  # Install dependencies
  RUN yarn install
  # If you are building your code for production
  # RUN npm ci --only=production

  # Bundle app source
  COPY . .

  EXPOSE 8080

  # Default command
  CMD [ "yarn", "dev" ]
  ```

- Create `.dockerignore` file with the following content:
  ```yml
  node_modules
  npm-debug.log
  ```
- Build your image
  Go to the directory that has your `Dockerfile` and run the following command to build the Docker image. The `-t` flag lets you tag your image so it's easier to find later using the `docker images` command:

  ```s
  $ docker build -t <your username>/node-docker .
  ```
  Your image will now be listed by Docker:
  ```s
  $ docker images

  # Example
  REPOSITORY                      TAG        ID              CREATED
  node                            12         1934b0b038d1    5 days ago
  <your username>/node-web-app    latest     d64d3505b0d2    1 minute ago
  ```

- Run the image
  Running your image with `-d` runs the container in detached mode, leaving the container running in the background. The `-p` flag redirects a public port to a private port inside the container. Run the image you previously built:

  ```s
  $ docker run -p 8080:8080 -it -d <your username>/node-docker
  # or just simply

  $ docker run -p 8080:8080 -it <yourname>/node-docker

  ```

  Print the output of your app:
  ```s
  # Get container ID
  $ docker ps

  # Print app output
  $ docker logs <container id>

  # Example
  Running on http://localhost:8080
  ```

  If you need to go inside the container you can use the exec command:

  ```s
  # Enter the container
  $ docker exec -it <container id> /bin/bash
  # or
  $ docker exec -it <container id> sh
  ```
- Test your Docker container
  To test your app, get the port of your app that Docker mapped:
  ```s
  $ docker ps

  # Example
  ID            IMAGE                                COMMAND    ...   PORTS
  ecce33b30ebf  <your username>/node-docker:latest  npm start  ...   8080->8080
  ```

  In the example above, Docker mapped the 8080 port inside of the container to the port 49160 on your machine.

  Now you can call your app using curl (install if needed via: sudo apt-get install curl):

  ```s
  $ curl -i localhost:8080

  HTTP/1.1 200 OK
  X-Powered-By: Express
  Content-Type: text/html; charset=utf-8
  Content-Length: 9
  ETag: W/"9-leKwfhJ1TlLDfP1IVUTU9ERZe/8"
  Date: Mon, 23 Nov 2020 14:41:00 GMT
  Connection: keep-alive

  Hi there!
  ```

  
- Some useful other commands 
  ```s
  $ docker images #show all images installed
  $ docker rmi -f <image id> #remove image by id
  $ docker ps #list all containers running
  $ docker ps -aq #list all containers (only ids)
  $ docker stop <container id> #stop a container
  $ docker stop $(docker ps -aq) #stop all running container
  $ docker rm $(docker ps -aq) #remove all containers
  $ docker rmi $(docker images -q) #remove all images
  $ docker system prune #remove all stopped containers, all dangling images, all networks, all dangling build cache
  $ docker system prune -a # remove all stopped container, all images, all networks, all build caches

  ```

## Reference
- [Official Nodejs Docker image](https://hub.docker.com/_/node/)
- [Nodejs Docker best practice guide](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
- [Official Docker documentation](https://docs.docker.com/)
- [Doc guides NodeJS-Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Doc guides Docker-NodeJS](https://docs.docker.com/get-started/nodejs/build-images/)