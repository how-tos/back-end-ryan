const mongoose = require('mongoose');

const stepSchema = mongoose.Schema({
  text: { type: String, required: true },
  image: String,
  title: { type: String, required: true, trim: true }
});

const howToSchema = mongoose.Schema({
  // mongoose automatically adds the `_id` field
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: Date,
  favoriteCount: Number,
  steps: [stepSchema],
  tags: [String],
  title: { type: String, required: true }
});

const HowTo = mongoose.model('how-to', howToSchema);

//
// *** DATABASE HELPER FUNCTIONS *** //
//

module.exports = {
  addHowTo,
  editHowTo,
  deleteHowto,
  getHowTo
};

function addHowTo(howTo) {
  return HowTo.create(howTo);
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

function getHowTo(filter) {
  return HowTo.find(filter);
}

// UNFINISHED
// function favoriteHowTo(userID, howToID) {
//   HowTo.findById()
// }

// favorite how to
// CRUD for steps, too
