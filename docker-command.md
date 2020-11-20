# Commands in docker

## All commandline

[All commandline](https://docs.docker.com/engine/reference/commandline/docker/)

## Stop container

- Stop running containers
  ```
  $ docker-compose down
  ```
- Stop containers and remove the volumes created by up.
  ```
  $ docker-compose down --volumes
  ```
- Stop containers and remove containers, networks, volumes, and images created by up.
  ```
  $ docker-compose down --rmi all --volumes
  ```
  Be careful, using --rmi all removes all images used by any service
See the [docs](https://docs.docker.com/compose/reference/down/) to choose the options that best suit your needs.

## Remove container

- As I had shared volumes for db data, I removed the tmp/db folder from the repository just to be sure.
  ```
  $ rm -rf tmp/*
  ```
- Remove all container and images
  ```
  $ docker rm -f CONTAINER_ID
  $ docker rm $(docker ps -q -a) -f
  $ docker rm $(docker ps -q -a) -f
  $ docker rmi $(docker images -q) -f
  $ docker container prune
  ```
## List docker container

- Documentation Docker
  ```
  $ docker container ls [OPTIONS]
  ```
  --all , -a		Show all containers (default shows just running)
  --filter , -f		Filter output based on conditions provided
  --format		Pretty-print containers using a Go template
  --last , -n	-1	Show n last created containers (includes all states)
  --latest , -l		Show the latest created container (includes all states)
  --no-trunc		Don’t truncate output
  --quiet , -q		Only display numeric IDs
  --size , -s		Display total file sizes
- Listing locally stored docker image
  ```
  docker image list
  ```

## Docker rename

```
$ docker rename my_container my_new_container
```