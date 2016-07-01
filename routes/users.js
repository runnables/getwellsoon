'use strict';

const randomstring = require('randomstring');
// const request = require('superagent');
const Router = require('express').Router;
const AccessToken = require('../models/accessToken');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = new Router();

const hashPassword = (password) => (
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  })
);

const comparePassword = (password, passwordHash) => (
  new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, isMatched) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatched);
      }
    });
  })
);

const generateToken = () => {
  const _generateToken = (resolve) => {
    const token = randomstring.generate(48);
    AccessToken.findOne({ token }, (err, accessToken) => {
      if (err || accessToken) {
        _generateToken(resolve);
      } else {
        resolve(token);
      }
    });
  };
  return new Promise(_generateToken);
};


router.get('/', (req, res) => {
  res.status(200).send({ message: 'success' });
});


module.exports = router;
