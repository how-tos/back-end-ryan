require('dotenv').config();

const server = require('./server');

const port = process.env.PORT || 3300;

server.listen(port, () =>
  console.log(`\n*** Server Running on Port ${port}! ***\n`)
);
