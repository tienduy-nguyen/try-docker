# Docker Compose

## Installation
There are two way to install docker-compose for ubuntu.

### 1. Install docker-compose from Ubuntu Repository

- Installation
  ```
  $ sudo apt install docker-compose
  ```

- Check docker-compose version to confirm the installation

  ```
  $ docker-compose --version
  $ docker-compose version
  ```

### 2. Install the lastest docker-compose version from the official git repository

- At the time of this writing, the most current stable version is `1.26.0`.

  ```
  $ sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

  ```

- Next, set the correct permissions so that the docker-compose command is executable:

  ```
  $ sudo chmod +x /usr/local/bin/docker-compose
  ```
- To verify that the installation was successful, you can run:
  ```
  $ docker-compose --version
  ```

## Settings up a docker-compose.yml file

Tuto from [digitalocean.com](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)

- Demonstrate how to set up a docker-compose.yml file using [Nginx image](https://hub.docker.com/_/nginx) from [Docker Hub](https://hub.docker.com/)
  ```
  $ mkdir ~/compose-demo
  $ cd ~/compose-demo
  ```
- In this directory, setup an application folder to serve as the document root for your Nginx enviroment.
  ```
  $ mkdir app
  ```
- Create an `app/index.html` file in this folder `app`

  ```html
  <!-- ~/compose-demo/app/index.html -->
  <!doctype html>
  <html lang="en">
  <head>
      <meta charset="utf-8">
      <title>Docker Compose Demo</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/dark.min.css">
  </head>
  <body>

      <h1>This is a Docker Compose Demo Page.</h1>
      <p>This content is being served by an Nginx container.</p>

  </body>
  </html>
  ```
- Create a `docker-compose.yml` file

  ```yml
  # docker-compose.yml
  version: '3.7'
  service: 
    web: 
      image: nginx:alpine
      ports: 
        - "8000:80"
      volumes:
        - ./app/usr/share/nginx/html

  ```

  The docker-compose.yml file typically starts off with the version definition. This will tell Docker Compose which configuration version we’re using.

  We then have the services block, where we set up the services that are part of this environment. In our case, we have a single service called web. This service uses the nginx:alpine image and sets up a port redirection with the ports directive. All requests on port 8000 of the host machine (the system from where you’re running Docker Compose) will be redirected to the web container on port 80, where Nginx will be running.

  The volumes directive will create a shared volume between the host machine and the container. This will share the local app folder with the container, and the volume will be located at /usr/share/nginx/html inside the container, which will then overwrite the default document root for Nginx.

## Running Docker Compose

- With the `docker-compose.yml` file in place, we can now execute Docker Compose to bring our environment up. The following command will download the necessary Docker images, create a container for the web service, and run the containerized environment in background mode:

  ```
  $ docker-compose up -d
  ```
- Your environment is now up and running in the background. To verify that the container is active, you can run:
  ```
  $ docker-compose ps
  ```
- You can now access the demo application by pointing your browser to either localhost:8000 if you are running this demo on your local machine, or your_server_domain_or_IP:8000 if you are running this demo on a remote server.

## Getting Familiar with Docker Compose Commands

- To check the logs produced by your Nginx container, you can use the logs command:

  ```
  $ docker-compose logs
  ```
- If you want to pause the environment execution without changing the current state of your containers, you can use:
  ```
  $ docker-compose pause
  ```
- To resume execution after issuing a pause:
  ```
  $ docker-compose unpause
  ```
- The stop command will terminate the container execution, but it won’t destroy any data associated with your containers:
  ```
  $ docker-compose stop
  ```
- If you want to remove the containers, networks, and volumes associated with this containerized environment, use the down command:
  ```
  $ docker-compose down
  ```

  Notice that this won’t remove the base image used by Docker Compose to spin up your environment (in our case, nginx:alpine). This way, whenever you bring your environment up again with a docker-compose up, the process will be much faster since the image is already on your system.

- In case you want to also remove the base image from your system, you can use
  ```
  $ docker image rm nginx:alpine
  ```

You can also check on the [official documentation](https://docs.docker.com/compose/reference/overview/)