// Requiring the mongoose library
const db = require("mongoose");

// New user scheme created with defining fields for each user
const User = new db.Schema({
  // Email/username must be unique (i.e. no player can have the same email or username as another REGISTERED player)
  email: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true, lowercase: true },
  password: { type: String },
});

// Exports the user schema to be used within other parts of the program
module.exports = db.model("User", User);
