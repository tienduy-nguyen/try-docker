# Build customs images from Dockerfile
- [Build customs images from Dockerfile](#build-customs-images-from-dockerfile)
  - [Creating Docker Images](#creating-docker-images)
    - [Dockerfile](#dockerfile)
    - [Create Dockerfile](#create-dockerfile)
      - [Create Dockerfile](#create-dockerfile-1)
      - [Build Dockerfile](#build-dockerfile)
      - [Run Docker](#run-docker)
## Creating Docker Images

### Dockerfile
- Specify a base image
- Run some commands to install additional programs
- Specify a command to run on container startup
### Create Dockerfile
For example: We will create a redis-image

```bash
$ mkdir redis-image
$ cd redis-image
$ touch Dockerfile
```
In this Dockerfile, we will:
- Use an existing docker image as a base
- Download and install dependencies
- Tell the image what to do when it starts as a container

#### Create Dockerfile
```Dockerfile
# Use an existing docker image as a base
FROM alpine

# Download and install dependencies
RUN apk add --update redis

# Tell the image what to do when it starts as a container
CMD [ "redis-server" ]
```

#### Build Dockerfile
```bash
$ docker build .
```


#### Run Docker
Get id built from terminal and run it
ex : `Successfully built 5c73dfcb328e`
```bash
$ docker run 5c73dfcb328e
```