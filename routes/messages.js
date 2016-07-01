'use strict';

// const request = require('superagent');
const Router = require('express').Router;
const Message = require('../models/message');
const Promise = require('bluebird');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));


const router = new Router();

router.get('/', (req, res) => (
  Message.find({ _id: { $lt: req.query.lastId } })
    .limit(30)
    .populate('user')
    .sort({ _id: -1 })
    .exec((err, messages) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.status(200).send({
          messages,
          next: messages[messages.length - 1]._id,
        });
      }
    })
));

router.post('/', (req, res) => {
  req.checkBody('image', 'Invalid Image').notEmpty().isBase64();
  req.checkBody('title', 'Invalid title').notEmpty();
  req.checkBody('detail', 'Invalid detail').notEmpty();

  req.sanitizeBody('title').toString();
  req.sanitizeBody('detail').toString();
  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send({
      message: 'There have been validation errors',
      errors,
    });
  }

  const message = new Message({
    image: req.body.image,
    title: req.body.title,
    detail: req.body.detail,
  });

  const dir = path.join(global.basePath, 'media', 'messages');
  const coverImagePath = path.join(dir, `${message._id}.jpg`);

  return fs.writeFileAsync(coverImagePath, req.body.image, 'base64')
    .then(() => {
      message.imagePath = `/media/messages/${message._id}.jpg`;
      return message.save();
    })
    .then(() => (
      res.status(200).send(message)
    ))
    .catch(err => {
      res.status(500).send(err);
    });
});

module.exports = router;
