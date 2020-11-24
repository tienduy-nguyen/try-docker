const express = require('express');
const redis = require('redis');
const app = express();
const process = require('process');

const client = redis.createClient({
  host: 'redis-server',
  port: '6379',
});
client.on('error', function (error) {
  console.error(error);
});
client.set('visits', 0);

app.get('/', (req, res) => {
  process.exit(0);
  client.get('visits', (err, visits) => {
    res.send('Number of visits is ' + visits);
    client.set('visits', parseInt(visits) + 1);
  });
});

const port = 8080;
app.listen(port, () => {
  console.log('App Redis is running on port 8080');
});
