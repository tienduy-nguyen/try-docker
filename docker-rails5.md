# Docker in project Ruby on Rails5



## Requirement

Docker Compose like Docker for Mac


- Make sure `docker-compose` installed in your machine.

[Docker-compose Installation](installation_docker-compose.md)

- Ruby version 2.5.1 or higher (here I use 2.7.1)
- Rails version 5.2.4 or higher
- PostgreSQL lastest version (12)


## Build rails 5 app with Docker

```bash
$ mkdir rails5-docker
$ cd rails5-docker
```

### Dockerfile
- Create Dockerfile

  ```
  $ touch Dockerfile
  ```

- Copy and past in the following

  ```
  FROM ruby:2.7.1

  LABEL author.name="TienDuy" \
    author.email="tienduy.nguyen.dev@gmail.com" \
    author.website="adev42.com"

  RUN apt-get update && apt-get install -y nodejs postgresql-client

  RUN mkdir /app
  ENV APP_PATH /app
  WORKDIR $APP_PATH

  COPY Gemfile Gemfile.lock $APP_PATH/
  RUN bundle install

  # Copy the main application.
  COPY . $APP_PATH

  # Add a script to be executed every time the container starts.
  COPY docker-entrypoint.sh /usr/bin/
  RUN chmod +x /usr/bin/docker-entrypoint.sh
  ENTRYPOINT [ "docker-entrypoint.sh" ]

  EXPOSE 3000

  # Start the main process.
  CMD [ "rails", "server", "-b", "0.0.0.0" ]
  ```
### Gemfile
- Create `Gemfile`
  ```
  $ touch Gemfile
  ```
- Paste in the following
  ```
  source 'https://rubygems.org'
  gem 'rails', '~>5'
  ```

### Gemfile.lock

- Create `Gemfile.lock` with noting in it.
  ```
  $ touch Gemfile.lock
  ```
  A Gemfile describes dependencies for a Ruby program.
  
  This file is where Bundler notes the exact versions of the Ruby libraries installed. In Rails development, you normally never touch this file, but Docker requires it.

### docker-entrypoint.sh

- Create `docker-entrypoint.sh`
  ```
  #!/bin/bash
  set -e

  # Remove a potentially pre-existing server.pid for rails
  rm -f /app/tmp/pids/server.pid

  # Then exec the container's main process (what's set as CMD in the Dockerfile).
  exec "$@"
  ```

  This fixes a Rails issue that prevents the server from restarting if a server.pid exists.

  For `docker-entrypoint.sh`, you will use the same name as you write in your `Dockerfile`.

### docker-compose.yml

- `docker-composer.yml` describes the services in your app.
  ```
  $ touch docker-compose.yml
  ```

- Paste in the follwing
  
  ```
  version: '3'
  services:
    postgres:
      image: postgres:latest
      volumes:
        - ./tmp/db:/var/lib/postgresql/data
      ports:
        - '5432:5432'
      environment:
        POSTGRES_HOST_AUTH_METHOD: trust
    app:
      container_name: app
      environment:
        DATABASE_URL: 'postgres://postgres:@postgres:5432/rails5_docker_development'
        RAILS_ENV: 'development'
      build: .
      command: bash -c "rm -f tmp/pids/server.pid && bundle exec rails s -p 3000 -b '0.0.0.0'"
      volumes:
        - .:/app
      ports:
        - '3000:3000'
      depends_on:
        - postgres
      links:
        - postgres
  ```
## Build the app

- Run the command to build your app
  ```
  docker-compose run app rails new . --force --no-deps --database=postgresql
  ```
  Note that you need to prefix any traditional Rails command like rake... with `docker-compose run app`.
  ```
  docker-compose build
  ```
- Create the database
  ```
  docker-compose run app rails db:create
  ```
- Start the server
  ```
  docker-compose up
  ```
  At this point, you should be able to navigate to http://localhost:3000 in your local browser and see the app running.
- Stop the server