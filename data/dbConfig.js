const mongoose = require('mongoose');

const userModel = require('../api/users/users-model').User;
const fakeUserOne = require('../api/users/users-model').fakeUserOne;

// The URI is like a URL, but for the remote database
const uri = process.env.MONGODB_URI;
// // Create pending connection to remote DB
mongoose.connect(uri, { useNewUrlParser: true });

// Access the DB via the connection
const db = mongoose.connection;

// Log in case there's an error while connecting
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = db;
