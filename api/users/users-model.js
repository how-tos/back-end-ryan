const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // mongoose automatically adds the `_id` field
  favoriteList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HowTo' }],
  name: {
    first: { type: String, trim: true },
    last: { type: String, trim: true }
  },
  passHash: { type: String, required: true },
  username: { type: String, required: true, trim: true, unique: true }
});

// Take the `userSchema` and create the `model`
const User = mongoose.model('User', userSchema, 'users');

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
      console.log(newUser);
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
  return User.find().select('favoriteList username _id name');
}

async function toggleFavorite(userID, howToID, isFavorite) {
  return new Promise(async function(resolve, reject) {
    try {
      let result = {};
      const user = await User.findById(userID);
      if (!user) resolve(null);
      const favIndex = await user.favoriteList.indexOf(howToID);
      console.log('favIndex: ', favIndex);
      // test the above code first
      if (favIndex >= 0 && !isFavorite) {
        user.favoriteList.pull(howToID);
        result.favoriteChange = 'removed';
        const newUser = await user.save();
        result.favoriteList = newUser.favoriteList;
      } else if (favIndex < 0 && isFavorite) {
        user.favoriteList.push(howToID);
        const newUser = await user.save();
        result.favoriteList = newUser.favoriteList;
        result.favoriteChange = 'added';
      } else {
        result.favoriteChange = null;
      }
      resolve(result);
    } catch (error) {
      console.error('toggleFavorite error: ', error);
      reject(error);
    }
  });
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
