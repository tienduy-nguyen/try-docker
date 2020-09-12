# Error with Docker

### 1. Error Postgres: Failed to bind tcp 0.0.0.0:5432 address already in use

When you create your app with postgresql through Docker, you maybe see sometimes the error: Failed to bind tcp 0.0.0.0:5432 address already in use.

--> To solve this problem, we need to kill it.

- Check service postgres in use
  ```
  $ sudo lsof -i :5432
  ```  

- Kill process
  ```
  sudo kill <pid>
  ```
  [Solution on stackoverflow](https://stackoverflow.com/questions/38249434/docker-postgres-failed-to-bind-tcp-0-0-0-05432-address-already-in-use)

### 2. Error PG::ConnectionBad: could not translate host name "postgres" to address: No address associated with hostname

This problem happened when create a database in rails app with postgresql.

- name "postgres" is the name of database service that I used in my Dockerfile. You maby use "db", "pg" or anything else name.


