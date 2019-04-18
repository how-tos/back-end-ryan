const mongoose = require('mongoose');

const StepsSchema = mongoose.Schema({
  image: String,
  howTo: { type: mongoose.Schema.Types.ObjectId, ref: 'HowTo', required: true },
  text: String,
  title: { type: String, required: true }
});

const Steps = mongoose.model('Steps', StepsSchema, 'steps');

//
// *** DATABASE HELPER FUNCTIONS *** //
//

const HowTos = require('../how-to/how-to-model');

module.exports = {
  addStep,
  editStep,
  deleteStep,
  getSteps
  // getStepByID
};

function addStep(howToID, step) {
  return HowTos.getHowToByID(howToID, false)
    .then(howTo => {
      howTo.steps.push(step);
      return howTo.save().then(savedHowTo => savedHowTo.steps);
    })
    .catch(error => {
      throw error;
    });
}

function getSteps(howToID) {
  return HowTos.getHowToByID(howToID)
    .then(howTo => howTo.steps)
    .catch(error => {
      throw error;
    });
}

function editStep(howToID, stepID, changes) {
  return HowTos.getHowToByID(howToID)
    .then(howTo => {
      let step = howTo.steps.id(stepID);
      if (!step) return null;
      for (let key of Object.keys(changes)) {
        step[key] = changes[key];
      }
      return howTo.save().then(savedHowTo => savedHowTo.steps);
    })
    .catch(error => {
      throw error;
    });
}

function deleteStep(howToID, stepID) {
  return HowTos.getHowToByID(howToID).then(howTo => {
    let step = howTo.steps.id(stepID)
    if (!step) return null;
    step.remove();
    return howTo.save().then(savedHowTo => savedHowTo);
  });
}
