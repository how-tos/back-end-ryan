const mongoose = require('mongoose');

const userModel = require('../api/users/users-model').User;

// The URI is like a URL, but for the remote database
const uri = process.env.MONGODB_URI;
// // Create pending connection to remote DB
mongoose.connect(uri, { useCreateIndex: true, useNewUrlParser: true });

// Access the DB via the connection
const db = mongoose.connection;

// Log in case there's an error while connecting
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Mongo Connection Up!');
});

module.exports = db;
