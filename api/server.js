const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const authRoutes = require('./auth/auth-routes');
const usersRoutes = require('./users/users-routes');
const restrictedMiddleware = require('./auth/restricted-middleware');

const server = express();

server.use(cors());
server.use(express.json());
server.use(helmet());

// Routing
server.use('/api/auth', authRoutes);
server.use('/api/users', restrictedMiddleware, usersRoutes);

module.exports = server;