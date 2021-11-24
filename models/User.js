const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // unique = permet qu'on ne puisse pas utiliser plusieurs fois une meme adresse mail + package "mongoose-unique-validator"
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // appliquer le validator au schema

module.exports = mongoose.model('User', userSchema);