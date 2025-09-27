const mongoose = require("mongoose");

// Shorthand for { type: String } is String
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  password: String,
  age: {
    type: Number,
  },
  gender: String,
});

module.exports = mongoose.model("User", userSchema);
