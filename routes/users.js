var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

router.get(
	'/',
	authenticate.verifyUser,
	authenticate.verifyAdmin,
	(req, res, next) => {
		User.find({}, (err, users) => {
			if (err) {
				return next(err);
			} else {
				res.statusCode = 200;
				res.setHeader('Content_type', 'application/json');
				res.json(users);
			}
		});
	}
);

router.post('/signup', (req, res, next) => {
	User.register(
		new User({
			username: req.body.username,
			admin: req.body.admin,
		}),
		req.body.password,
		(err, user) => {
			if (err) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({
					err: err,
				});
			} else {
				if (req.body.firstname) {
					user.firstname = req.body.firstname;
				}
				if (req.body.lastname) {
					user.lastname = req.body.lastname;
				}
				user.save((err, user) => {
					passport.authenticate('local')(req, res, () => {
						if (err) {
							res.statusCode = 500;
							res.setHeader('Content-Type', 'application/json');
							res.json({
								err: err,
							});
							return;
						}
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({
							success: true,
							status: 'Registration Successful!',
						});
					});
				});
			}
		}
	);
});

router.post('/login', passport.authenticate('local'), (req, res) => {
	var token = authenticate.getToken({ _id: req.user._id });
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({
		success: true,
		token: token,
		id: { _id: req.user._id },
		status: 'You are successfully logged in!',
	});
});

router.get('/logout', (req, res, next) => {
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/');
	}
});

module.exports = router;