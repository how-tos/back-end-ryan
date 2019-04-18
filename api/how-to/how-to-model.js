const mongoose = require('mongoose');

const stepSchema = mongoose.Schema({
  text: { type: String, required: true },
  image: String,
  title: { type: String, required: true, trim: true }
});

const howToSchema = mongoose.Schema({
  // mongoose automatically adds the `_id` field
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created: Date,
  favoriteCount: { type: Number, default: 0 },
  steps: [stepSchema],
  tags: [String],
  title: { type: String, required: true }
});

const HowTo = mongoose.model('HowTo', howToSchema, 'howtos');

//
// *** DATABASE HELPER FUNCTIONS *** //
//

const toggleUserFavorite = require('../users/users-model').toggleFavorite;

module.exports = {
  addHowTo,
  deleteHowto,
  editHowTo,
  favoriteHowTo,
  getHowToByFilter,
  getHowToByID
};

function addHowTo(howTo) {
  return HowTo.create(howTo);
  // What happens if the `author` isn't a valid _id?
}

function editHowTo(id, changes) {
  return HowTo.findById(id)
    .then(doc => {
      if (!doc) return null;
      for (let key of Object.keys(changes)) {
        doc[key] = changes[key];
      }
      return doc.save();
    })
    .catch(error => {
      throw error;
    });
}

function deleteHowto(id) {
  return HowTo.deleteOne({ _id: id });
}

function getHowToByFilter(filter) {
  return HowTo.find(filter);
}

function getHowToByID(id, populateAuthor = true) {
  return populateAuthor
    ? HowTo.findById(id).populate('author')
    : HowTo.findById(id);
}

async function favoriteHowTo(userID, howToID, isFavorite) {
  return new Promise(async function(resolve, reject) {
    try {
      const howTo = await HowTo.findById(howToID);
      if (!howTo) resolve({ missing: 'how to', code: 404 });

      const userToggle = await toggleUserFavorite(userID, howToID, isFavorite);
      if (!userToggle) resolve({ missing: 'user', code: 404 });

      switch (userToggle.favoriteChange) {
        case 'added':
          console.log('case added');
          howTo.favoriteCount++;
          const savedHowToAdded = await howTo.save();
          resolve({
            favoriteChange: userToggle.favoriteChange,
            favoriteCount: savedHowToAdded.favoriteCount
          });
          break;
        case 'removed':
          console.log('case removed');
          howTo.favoriteCount--;
          const savedHowToRemoved = await howTo.save();
          resolve({
            favoriteChange: userToggle.favoriteChange,
            favoriteCount: savedHowToRemoved.favoriteCount
          });
          break;
        default:
          console.log('default case');
          resolve({
            favoriteChange: userToggle.favoriteChange,
            favoriteCount: howTo.favoriteCount
          });
      }
    } catch (error) {
      console.error('favoriteHowTo error: ', error);
      reject(error);
    }
  });
}

// CRUD for steps, too
