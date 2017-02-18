var express = require('express');
var fs = require('fs');
var util = require('util');
var Mustache = require('mustache');
var nunjucks  = require('nunjucks');

global.flock = require('flockos');
global.assert = require('assert');
global.app = express();

var flockConfig = require('./config/flock_config');
var mongoConfig = require('./config/mongo_config');
var mongoOperations = require('./app/db/mongo_operations');

app.use(flock.events.tokenVerifier);
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'html');
app.listen(8080, function () {
    console.log('Listening on 8080');
});

mongoConfig.connect(function(db){
	mongoOperations.setDBInstance(db);
});

flock.appId = flockConfig.appId;
flock.appSecret = flockConfig.appSecret;

var flockEvents = require('./app/flock/events');
var flockMethods = require('./app/flock/methods');

nunjucks.configure(`${__dirname}/views`, {
  autoescape: true,
  express   : app
});

app.post('/events', flock.events.listener);
app.get('/config', function(req, res){
	res.render('config');
});