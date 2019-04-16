const db = require('../../data/dbConfig');
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

// Take the `userSchema` and create a `model`
const User = mongoose.model('users', userSchema);

// *** DATABASE HELPER FUNCTIONS *** //

module.exports = {
  addUser,
  deleteUser,
  dropUsersTable,
  getUsers
};

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
