const mongoose = require('mongoose');

// The URI is like a URL, but for the remote database
const uri = process.env.MONGODB_URI;
// // Create pending connection to remote DB
mongoose.connect(uri);

// Access the DB via the connection
const db = mongoose.connection;

// Log in case there's an error while connecting
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {});