'use strict';


const AccessToken = require('../models/accessToken');

module.exports = {
  authenticate: () => (
    (req, res, next) => {
      const accessToken = req.query.accessToken || req.body.accessToken;

      req.currentUserId = null;
      req.currentUser = null;
      req.accessToken = null;

      if (!accessToken) {
        next();
        return;
      }

      AccessToken
        .findOne({ token: accessToken })
        .populate('user')
        .exec((err, foundAccessToken) => {
          if (err) {
            return next(err);
          }
          if (foundAccessToken) {
            req.currentUserId = foundAccessToken.user ? String(foundAccessToken.user._id) : null;
            req.currentUser = foundAccessToken.user;
            req.accessToken = foundAccessToken._id;
          }
          return next();
        });
    }
  ),
};
