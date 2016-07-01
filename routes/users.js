'use strict';

const randomstring = require('randomstring');
const request = require('superagent');
const Router = require('express').Router;
const AccessToken = require('../models/accessToken');
const User = require('../models/user');
const facebookBaseUrl = 'https://graph.facebook.com/v2.6';

const router = new Router();

const getFacebookProfile = accessToken => (
  request
    .get(`${facebookBaseUrl}/me?access_token=${accessToken}&fields=name,email,picture.width(200)`)
    .set('Accept', 'application/json')
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


const loginWithFacebook = (req, res) => {
  req.checkBody('token', 'Invalid Facebook token').notEmpty();
  req.sanitizeBody('token').toString();
  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send({
      message: 'There have been validation errors',
      errors,
    });
  }

  return getFacebookProfile(req.body.token)
    .then(profile => {
      profile = profile.body;
      let profileImage = '';
      if (!(profile && profile.email)) {
        return Promise.reject({ message: 'facebook id is unavailable' });
      }
      if (profile.picture && profile.picture.data && profile.picture.data.url) {
        profileImage = profile.picture.data.url;
      }
      return User.findOneAndUpdate({ email: profile.email }, {
        facebookId: profile.id,
        name: profile.name,
        profileImage,
      }, {
        upsert: true,
        new: true,
      });
    })
    .then(user => {
      generateToken()
        .then((token) => {
          const accessToken = new AccessToken({
            user,
            token,
          });
          accessToken.save().then(() => (
            res.status(200).send({ token, user })
          ));
        });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

router.get('/me', (req, res) => {
  if (req.currentUser) {
    return res.status(200).send(req.currentUser);
  }
  return res.status(403).send({message: 'Forbidden'});
});

router.post('/login', loginWithFacebook);


module.exports = router;
