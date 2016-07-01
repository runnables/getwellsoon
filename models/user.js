'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  profileImage: { type: String },
  messages: [
    {
      title: { type: String },
      detail: { type: String },
      image: { type: String },
    },
  ],
});

module.exports = mongoose.model('User', schema);
