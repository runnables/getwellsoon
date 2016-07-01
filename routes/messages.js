'use strict';

// const request = require('superagent');
const Router = require('express').Router;
const Message = require('../models/message');

const router = new Router();

router.get('/', (req, res) => {
  res.status(200).send({ message: 'success' });
});

module.exports = router;
