const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const usersRoutes = require('./users/users-routes');

const server = express();

server.use(cors());
server.use(express.json());
server.use(helmet());

// Routing
server.use('/api/users', usersRoutes);

module.exports = server;