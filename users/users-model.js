const db = require('../data/dbConfig');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  // mongoose automatically adds the `_id` field
  username: { type: String, required: true, trim: true, unique: true },
  name: {
    first: { type: String, trim: true },
    last: { type: String, trim: true }
  },
  passHash: { type: String, required: true }
});

// userSchema.virtual('fullName').get(function() {
//   return `${this.name.first} ${this.name.last}`;
// });

// Take the `userSchema` and create a `model`
const User = mongoose.model('users', userSchema);

// Seed Data
const fakeUserOne = new User({
  username: 'MP',
  name: { first: 'Michael', last: 'Pollan' },
  passHash: '123abc'
});

// db.once('open', function callback() {
//   userModel.insertMany([fakeUserOne]).then(result => {
//     console.log('insertMany() result: ', result);
//     userModel
//       .find()
//       .then(docs => {
//         docs.forEach(doc => console.log('doc', doc));
//       })
//       .then(() => mongoose.connection.db.collection('users').drop())
//       .then(() => mongoose.connection.close())
//       .catch(error => console.error(error));
//   });
// });

/**
 * Takes `user` object, adds to DB, and returns persisted object if successful.
 * `user` should have `firstName`, `lastName`, `passHash`, and `username` properties
 * @param {object} user - user object
 */
function addUser(user) {
  return User.init()
    .then(() => User.create(user))
    .then(newUser => {
      delete newUser._doc.passHash;
      delete newUser._doc.__v;
      return newUser;
    })
    .catch(error => {
      throw error; // typically a unique-constraint error
    });
}

function getUsers() {
  return User.find().select('username _id name');
}

function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

function dropUsersTable() {
  return db.collection('users').drop();
}

// userModel.insertMany([fakeUserOne]).then(result => {
//   console.log('insertMany() result: ', result);
//   userModel
//     .find()
//     .then(docs => {
//       docs.forEach(doc => console.log('doc', doc));
//     })
//     .then(() => mongoose.connection.db.collection('users').drop())
//     .then(() => mongoose.connection.close())
//     .catch(error => console.error(error));
// });

module.exports = {
  addUser,
  deleteUser,
  dropUsersTable,
  getUsers
};
