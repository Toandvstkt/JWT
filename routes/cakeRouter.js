const express= require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
const Cake = require('../models/cakes');
const cakeRouter = express.Router();
var authenticate = require('../authenticate');
cakeRouter.use(bodyParser.json());

cakeRouter.route('/')
.get((req,res,next) => {
    Cake.find({})
    .populate('topping.type')
    .exec(function (err, cake) {
    if (err) throw err;
    res.json(cake);
});
})



.post(authenticate.verifyUser, (req,res,next) => {
    console.log(req.body);
    Cake.create(req.body) 
    .then((cake) => {
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json (cake);
    },(err) => next (err))
    .catch((err)=> next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Cakes');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Cake.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});
cakeRouter.route('/:cakeId')
.get((req,res,next) => {
    console.log(req.params.cakeId);
    Cake.findById(req.params.cakeId)
        .populate({
            path: 'topping',
            match: { value: { $gte: 2 } },
            select: 'price_extra'
        })
        .exec(function (err, cake) {
        if (err) throw err;
        res.json(cake);
    });
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Cakes/'+ req.params.cakeId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    Cake.findByIdAndUpdate(req.params.cakeId, {
        $set: req.body
    }, { new: true })
    .then((cake) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cake);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Cake.findByIdAndRemove(req.params.cakeId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



module.exports = cakeRouter
