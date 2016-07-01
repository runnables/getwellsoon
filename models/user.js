'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  facebookId: { type: String },
  name: { type: String },
  profileImage: { type: String },
});

module.exports = mongoose.model('User', schema);
