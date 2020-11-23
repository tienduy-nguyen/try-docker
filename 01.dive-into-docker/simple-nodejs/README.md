# Simple web app with Nodejs Using Docker

## Steps
- Create NodeJS web app
- Create a Dockerfile
- Build image from Dockerfile
- Run image as container
- Connect to web app from a browser

## Getting started

- Create root folder of project

  ```bash
  $ mkdir simple-nodejs
  $ cd simple-nodejs
  ```
- Init `package.json`
  ```bash
  $ yarn init -y
  ```

  Add dependencies and scripts in this **package.json** file
  ```json
  {
    
    "name": "simple-nodejs",
    "version": "1.0.0",
    "main": "index.js",
    "license": "MIT",
    "scripts": {
      "start": "node index.js",
      "dev": "nodemon index.js"
    },
    "dependencies": {
      "express": "*"
    }
  }
  ```
- Create `index.js` file (in root project)
  Add the following code to run server nodejs with `express` framework.

  ```js
  const express = require('express');

  const app = express();

  app.get('/', (req, res) => {
    res.send('Hi there!');
  });

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  ```