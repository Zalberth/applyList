var 
	http = require('http'),
	mysql = require('mysql'),
	uuid = require('node-uuid'),
	express = require('express'),
	fs = require('fs');
	routes = require('./routes'),
	app = express(),
	morgan = require('morgan'), //used to be logger
	bodyParser = require('body-parser'),
	menthodOverride = require('method-override'),
	server = http.createServer(app);
		app.use(morgan());
		app.use(bodyParser());
		app.use(menthodOverride());
var jsonObj = {};		
	
	app.use(express.static(__dirname+'/public')); 
	
	routes.configRoutes(app, server, mysql, uuid, fs, jsonObj);

	server.listen(3100);
	console.log('express server listening on port %d in %s mode',server.address().port,app.settings.env);