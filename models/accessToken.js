'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new mongoose.Schema({
  token: { type: String },
  user: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

schema.index({ _id: 1 });

module.exports = mongoose.model('AccessToken', schema);
