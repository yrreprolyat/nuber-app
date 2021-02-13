// app.js
var express = require('express');
var app = express();
var db = require('./db'); //ADD THIS LINE

// ADD THESE TWO LINES
var UserController = require('./user/UserController');
app.use('/users', UserController);

var AdminController = require('./admin/adminController');
app.use('/admins', AdminController);

var DriverController = require('./driver/DriverController');
app.use('/drivers', DriverController);

var RiderController = require('./rider/riderController');
app.use('/riders', RiderController);

module.exports = app;
