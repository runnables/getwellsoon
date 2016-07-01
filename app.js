'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const expressValidator = require('express-validator');
const helmet = require('helmet');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('config');
const authenticator = require('./middlewares/authenticator');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
const _ = require('lodash');
global.basePath = path.resolve(__dirname);

const app = express();
app.set('view engine', 'ejs');
mongoose.connect(`mongodb://${config.get('database.host')}:${config.get('database.port')}/${config.get('database.name')}`);

app.use('/media', express.static(path.join(__dirname, 'media')));
app.use(logger('dev'));
app.use(helmet());
app.use(helmet.noCache());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false, limit: 2 * 1024 * 1024 }));
app.use(bodyParser.json({ limit: 2 * 1024 * 1024 }));
app.use(expressValidator({
  customValidators: {},
}));
app.use(authenticator.authenticate());
app.use(express.static(__dirname + '/public'));

const Message = require('./models/message');
app.get('/', (req, res) => {
  Message.find().limit(30)
  .populate('user').sort({ _id: -1 })
  .then(messages => {
    res.render('index', {
      messages: messages,
      next: messages.length ? _.last(messages)._id : null
    });
  })
  .catch(err => {
    res.render('index');
  });
});

app.use('/users', routes.users);
app.use('/messages', routes.messages);
app.use(errorHandler());


module.exports = app;
