const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  // mongoose automatically adds the `_id` field
  username: { type: String, required: true },
  name: { first: String, last: String },
  passHash: String
});

// userSchema.virtual('fullName').get(function() {
//   return `${this.name.first} ${this.name.last}`;
// });

module.exports = userSchema;