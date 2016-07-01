'use strict';

// const request = require('superagent');
const Router = require('express').Router;
const Message = require('../models/message');

const router = new Router();

router.get('/', (req, res) => {

	Message.find({ _id : { "$lt" : req.query.lastId }})
		.limit(30)
		.populate('user')
		.sort({ "_id" : -1 })
		.exec(function(err, messages) {
		 	if (err) {
		    	res.status(500).send({ error: err });
		  	} else {
		    	res.status(200).send({
			    	messages,
			    	next: messages[messages.length-1]._id
		    	});
		  	}
	});

});

router.post('/', (req, res) => {

	var message = new Message({
		image: req.body.image,
		title: req.body.title,
		detail: req.body.detail
	});

	message.save(function(err){
		if(err){
			res.status(500).send({ error: err });
		} else {
			res.status(200).send(message);
		}
	});


});

module.exports = router;
