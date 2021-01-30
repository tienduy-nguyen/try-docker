# Testing with Prisma using Docker

## 🌴 Trouble in ( testing ) paradise

One small problem with Prisma is that it is not always clear how to write unit and functional tests. `.env` file is used by default but it takes a bit of work to get `.env`.test working as mentioned in this issue.

Docker is great to separate development and testing environment. With Docker, `.env` files are not needed because environment variables can be set when the containers are created. Since I was using Docker for development already, setting up a testing environment was very easy.

In this post, I will talk about my approach to writing tests for Prisma-integrated applications.

### ⚡ TLDR;
Create and run tests in Docker containers.
Set up and reset the database before and after tests.
For unit tests, create a Prisma client and disconnect after each test.
For functional tests, start a server and close it after each test.
Full example with working CI here: https://github.com/eddeee888/topic-prisma-testing

### 💻 Setup

**NPM Packages**

First, let's install the npm packages that we need. Run this in your host terminal:

```ts
$ yarn -D @prisma/cli @prisma/client @types/jest jest node-fetch ts-jest ts-node typescript
```

**Prisma schema**

Let's get started with a very simple Prisma schema:

```ts
// ./src/prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("PRISMA_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
}

```

**Notes:**

We use env("PRISMA_DATABASE_URL") for the url because we will give it different values based on whether we are in a testing or development environment.
A user's email is also unique so Prisma should throw an error if we try to add two users with the same email
App Docker container
We will need a Node container to run migrations and tests in. We do this in containers so the environment is consistent for everyone - no more "but it works on my machine" problems!

Create a Dockerfile to store what we need:
```dockerfile
# ./Dockerfile
FROM node:12.18.0-alpine3.11 AS base
WORKDIR /usr/src/app
RUN apk update \ 
  && apk add bash \
  && rm -rf /var/cache/apk/*
COPY . . 
RUN yarn install --frozen-lockfile
RUN yarn prisma generate

```

**docker-compose**

docker-compose is a tool to manage multi-container apps. In our case, we will need something like this:

```yml
# ./docker-compose.test.yml
version: "3.7"

services:
  server:
    build:
      context: "."
      target: base
    environment:
      SERVER_DATABASE_NAME: test_db
      PRISMA_DATABASE_URL: mysql://root:root@database:3306/test_db?schema=public
    ports:
      - 9999:80
    volumes:
      - ./src:/usr/src/app/src
      - ./package.json:/usr/src/app/package.json
    networks:
      - test_vm
    depends_on:
      - database

  database:
    image: mysql:5.7
    restart: always
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_PORT=3306
    volumes:
      - database:/var/lib/mysql
    expose:
      - 3307
    ports:
      - 3307:3306
    networks:
      - test_vm
volumes:
  database:
networks:
  test_vm:

```

The file above is quite long but don't fret! The most important things to note here are:

There are 2 services: server and database
server which is a server with node v12.18.0 ( and a few other things installed as stated in the Dockerfile above )
server has `PRISMA_DATABASE_URL` set, which means it can run Prisma commands against the database.
database is a mysql database ( which matches Prisma schema ).
🧑‍🍳 Prepare the testing environment
Let's start by building our Node image. We will use this image to manage migrations for the test database.

Run the following command on your host terminal:
```bash
$ docker-compose -f docker-compose.test.yml build --no-cache
```

You can check if your image has been built successfully by running the docker images command. 

Now, let's create a new migration:
```bash
$ docker-compose -f docker-compose.test.yml run --rm server yarn prisma migrate save --experimental --name add-user-model
```

Then, we apply the migration:
```bash
$ docker-compose -f docker-compose.test.yml run --rm server yarn prisma migrate up --experimental --create-db --auto-approve
```

## 🧪 Unit tests

**Writing unit tests**

We can't run tests unless we write a function to test first 😛. Let's add a simple function:

```ts
// ./src/actions/createUserAction.ts
import { PrismaClient, User } from "@prisma/client";
export interface CreateUserActionParams {
  prisma: PrismaClient;
  email: string;
}
const createUserAction = async ({
  prisma,
  email,
}: CreateUserActionParams): Promise<User> => {
  return await prisma.user.create({ data: { email } });
};
export default createUserAction;
```

This is a very contrived example that just calls Prisma functions underneath. The thing to note here is that a Prisma client is injected from the callsite to make it easy to test.

We will need to install the following packages to generate unique emails for our tests:
```bash
$ yarn add -D uuid @types/uuid
```

And here's our test file:
```ts
// ./src/actions/createUserAction.test.ts
import createUserAction from "./createUserAction";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});

describe("createUserAction() - unit", () => {
  it("creates new user correctly", async () => {
    const email = `${uuidv4()}@test.com`;

    await createUserAction({ prisma, email });

    const [savedUser] = await prisma.user.findMany({
      where: { email },
      take: 1,
    });

    expect(savedUser.email).toBe(email);
  });

  it("fails if tries to create records with the same user twice", async () => {
    const email = `${uuidv4()}@test.com`;

    await createUserAction({ prisma, email });

    const [savedUser] = await prisma.user.findMany({
      where: { email },
      take: 1,
    });

    expect(savedUser.email).toBe(email);

    await expect(() => createUserAction({ prisma, email })).rejects.toThrow(
      "Unique constraint failed on the constraint: `email_unique`"
    );
  });
});
```

Ok, let's inspect the important parts of this file:
```ts
const prisma = new PrismaClient();
afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});
```

Here, we create a new client for this test file ( and other files too ). This is fairly inexpensive so we can run it for every file. After all of the tests in this file, we will disconnect the Prisma client from the database to avoid hogging connections.
```ts
  it("creates new user correctly", async () => {
    const email = `${uuidv4()}@test.com`;

    await createUserAction({ prisma, email });

    const [savedUser] = await prisma.user.findMany({
      where: { email },
      take: 1,
    });

    expect(savedUser.email).toBe(email);
  });

```

In this test, we create a user with a unique email and make sure we can query it.

```ts
  it("fails if tries to create records with the same user twice", async () => {
    const email = `${uuidv4()}@test.com`;

    await createUserAction({ prisma, email });

    const [savedUser] = await prisma.user.findMany({
      where: { email },
      take: 1,
    });

    expect(savedUser.email).toBe(email);

    await expect(() => createUserAction({ prisma, email })).rejects.toThrow(
      "Unique constraint failed on the constraint: `email_unique`"
    );
  });

```
In this above test, we test that if we try to create a user with the same email, it will throw an error the second time!

**Running tests**

Finally, here's the moment we are all waiting for. Let's run the tests!
$ docker-compose -f docker-compose.test.yml run --rm server yarn jest -i
Note that -i flag is used to make sure we run tests one by one to avoid race conditions in tests.

Sometimes, our tests may fail because the database container is not ready before tests are run. It is highly recommended to be using something like wait-for-it.sh. We can copy the file into ./scripts/wait-for-it.sh. Then, we can run the following instead of the previous command:
```bash
$ docker-compose -f docker-compose.test.yml run --rm server ./scripts/wait-for-it.sh database:3306 -- yarn jest -i
```

### 🚗 Functional tests

Functional tests are specifications of how a system works. For example, if our app receives a request at a certain URL, a new user is created.

Let's create an app server. First, we need to install a few packages:
```bash
$ yarn add express
$ yarn add -D @types/express node-fetch @types/node-fetch
```

Then, we can create a server. Note that we don't start the server yet.

```ts
// ./src/createServer.ts

import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import createUserAction from "./actions/createUserAction";

export interface CreateServerParams {
  prisma: PrismaClient;
}

const createServer = ({ prisma }: CreateServerParams): Express => {
  const server = express();

  server.get("/new-user/:email", async (req, res) => {
    const { email } = req.params;

    try {
      await createUserAction({ prisma, email });
      return res.status(200).send("ok");
    } catch (e) {
      res.status(403).send(`Cannot create new user for email: ${email}`);
    }
  });

  return server;
};

export default createServer;
```

In here, our createServer function also takes a Prisma client to make it easier to test. If a GET request is sent to /new-user/:email ( e.g. http://website.com/new-user/cool.personl@zmail.com ), then we will call createUserAction to create a new user and send back 200 if is successful or 403 if encountered errors.

NOTE: Please DO NOT - I REPEAT, DO NOT - have a URL that can create new users on GET requests without input validation/authentication/authorization, etc. or you will get an army of angry pelicans delivering spams to your app! ☠️

Writing functional tests

Now, we can start a new server for our tests to run against:

```ts
// ./src/actions/createUserAction.functional.test.ts
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";
import createServer from "./createServer";

const prisma = new PrismaClient();
const server = createServer({ prisma });
const internalConfig: any = {};
beforeAll(async (done) => {
  const instance = await server.listen({ port: 80 });
  internalConfig.server = instance;
  done();
});
afterAll(async (done) => {
 internalConfig.server.close();
 await prisma.$disconnect();
 done();
});

describe("createUserAction() - functional", () => {
  it("creates new user correctly", async () => {
    const email = `${uuidv4()}@test.com`;

    const res = await fetch(`http://localhost/new-user/${email}`);

    expect(res.ok).toBe(true);
  });

  it("fails if tries to create records with the same user twice", async () => {
    const email = `${uuidv4()}@test.com`;

    await prisma.user.create({ data: { email } });

    const res = await fetch(`http://localhost/new-user/${email}`);

    expect(res.ok).toBe(false);
  });
});
```

Again, let's break this down:

```ts
const prisma = new PrismaClient();
const server = createServer({ prisma });
const internalConfig: any = {};
beforeAll(async (done) => {
  const instance = await server.listen({ port: 80 });
  internalConfig.server = instance;
  done();
});
afterAll(async (done) => {
 internalConfig.server.close();
 await prisma.$disconnect();
 done();
});
This snippet of code creates a new Prisma client for the server. Before the tests in this file start, start the server at port 80. After the tests in this file end, stop the server and disconnect Prisma client.
  it("creates new user correctly", async () => {
    const email = `${uuidv4()}@test.com`;

    const res = await fetch(`http://localhost/new-user/${email}`);

    expect(res.ok).toBe(true);
  });
In the above test, we send a request to our server, and if it is a new user, then it's all g!
  it("fails if tries to create records with the same user twice", async () => {
    const email = `${uuidv4()}@test.com`;

    await prisma.user.create({ data: { email } });

    const res = await fetch(`http://localhost/new-user/${email}`);

    expect(res.ok).toBe(false);
  });
```

In the second test, we are trying to create a user who already exists, which causes the response to fail. Perfect! 🕺

Then, we can run the same test command again:
$ docker-compose -f docker-compose.test.yml run --rm server ./scripts/wait-for-it.sh database:3306 -- yarn jest -i

## 👋 Summary

Testing Prisma is not simple because it is hard to separate an environment for testing. Using Docker solves this issue for me. Do you know of a different way to test Prisma? I would love to hear from you 😊

For the full development and test environment examples, including CI ( GitHub actions ), check out this repository: https://github.com/eddeee888/topic-prisma-testing.