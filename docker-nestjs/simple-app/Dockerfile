# Multistep build image docker
# Get image nodejs version 14 complete
FROM node:14-alpine as builder
EXPOSE 1776

# Create app directory in container
WORKDIR /usr/src/app

# Copy package.json & package-lock.json from local to containter
COPY package*.json ./

# Install dependencies
RUN yarn install


# Copy all rest files from local to container
COPY . ./

# Build file
RUN yarn build

# Get images smallest of nodejs
FROM node:14-alpine as final


# Copy files from builder to final image
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

CMD [ "yarn","start:prod" ]