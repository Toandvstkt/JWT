var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var app = express();
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then(
	(db) => {
		console.log('connected to server');
	},
	(err) => {
		console.log(err);
	}
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(cookieParser('12345-6789'));
app.use(
	session({
		name: 'session-id',
		secret: '12345-6789',
		saveUninitialized: false,
		resave: false,
		store: new fileStore(),
	})
);
function auth(req, res, next) {
	console.log(req.headers);
	//if(!req.signedCookies.user){
	if (!req.session.user) {
		var authHeader = req.headers.authorization;
		if (!authHeader) {
			var err = new Error('you are not authenticated');
			err.status = 401;
			next(err);
			return;
		}

		var auth = new Buffer.from(authHeader.split(' ')[1], 'base64')
			.toString()
			.split(':');
		var user = auth[0];
		var pass = auth[1];
		if (user == 'admin' && pass == '123') {
			//res.cookie('user','admin',{signed:true});
			req.session.user = 'admin';
			next(); //authorized
		} else {
			var err = new Error('you are not authenticated');
			err.status = 401;
			next(err);
			return;
		}
	} else {
		//if(req.signedCookies.user=='admin'){
		if (req.session.user == 'admin') {
			console.log('req.session: ', req.session);
			next();
		} else {
			var err = new Error('you are not authenticated');
			err.status = 401;
			next(err);
			return;
		}
	}
}
app.use(auth);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
