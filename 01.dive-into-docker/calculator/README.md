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

## Deploy AWS
- Create Environment for ElasticBeansTalk AWS
- Using Virtual Private Cloud (VPC AWS)
- Using Database PostgreSQL (RDS AWS)
- Elastic Cache Redis AWS
- Creating custom security group AWS (VPC)
- Add custom security group to Elastic Cache
- Add custom security group to Database RDS