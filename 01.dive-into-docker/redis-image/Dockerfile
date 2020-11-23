# Use an existing docker image as a base
FROM alpine

# Download and install dependencies
RUN apk add --update redis
# rebuild with cache if we have already installed redis for the previous time
RUN apk add --update gcc 

# Tell the image what to do when it starts as a container
CMD [ "redis-server" ]