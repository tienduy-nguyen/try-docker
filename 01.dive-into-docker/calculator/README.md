# Create simple calculator web app

Project using:
- **Docker**: for development environment
- **Nodejs**: with express for server
- **Worker**: with postgresql & redis
- **React**: for frontend


## Config Nginx
- Create `default.conf` config file for Nginx
  This file:
  - Tell Nginx that there is an 'upstream' server at client:3000
  - Tell Nginx that there is an 'upstream' server at server:5000
  Default of Nginx configuration:
  - Listen on port 80
  - If anyone comes to '/' send them to client upstream
  - If anyone come to '/api', send them to server upstream