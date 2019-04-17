// const db = require('../../data/dbConfig');
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
  getUsers,
  getByUsername,
  toggleFavorite,
  updateUser,
  User,
  userSchema
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

function getByUsername(username) {
  return User.findOne({ username });
}

function getUsers() {
  return User.find().select('username _id name');
}

async function toggleFavorite(userID, howToID) {
  try {
    const user = await User.findById(userID);
    const favIndex = await user.favoriteList.id(howToID);
    if (!favIndex) {
      user.favoriteList.pull(howToID);
    } else {
      user.favoriteList.push(howToID);
    }
    return user.favoriteList;
  } catch (error) {
    throw error;
  }
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
    .then(newUser => {
      delete newUser._doc.passHash;
      delete newUser._doc.__v;
      return newUser;
    })
    .catch(error => {
      throw error;
    });
}
