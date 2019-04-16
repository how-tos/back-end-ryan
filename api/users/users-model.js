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

// Take the `userSchema` and create the `model`
const User = mongoose.model('users', userSchema);

//
// *** DATABASE HELPER FUNCTIONS *** //
//

module.exports = {
  addUser,
  deleteUser,
  dropUsersTable,
  getUsers,
  updateUser
};

/**
 * Takes `user` object, adds to DB, and returns persisted object if successful.
 * `user` should have `firstName`, `lastName`, `passHash`, and `username` properties
 * @param {Object} user - user object
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

function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

function dropUsersTable() {
  return db.collection('users').drop();
}

function getUsers() {
  return User.find().select('username _id name');
}

function updateUser(id, changes) {
  return User.findById(id)
    .then(doc => {
      if (!doc) return null;
      for (let key of Object.keys(changes)) {
        doc[key] = changes[key];
      }
      return doc.save();
    })
    .catch(error => console.error(error));
}
