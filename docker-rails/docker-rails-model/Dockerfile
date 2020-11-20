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