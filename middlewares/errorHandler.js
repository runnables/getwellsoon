'use strict';

module.exports = () => (
  (err, req, res, next) => {
  	console.log(err);
    res
      .status(500)
      .send({
        errorCode: 'server_error',
        message: 'Server error',
      });

    return next();
  }
);
