'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new mongoose.Schema({
  user: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  title: { type: String },
  detail: { type: String },
  image: { type: String },
});

schema.index({ _id: 1 });

module.exports = mongoose.model('Message', schema);
