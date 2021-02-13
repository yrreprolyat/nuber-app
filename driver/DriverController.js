// DriverController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Driver = require('./Driver');
var Rider = require('../rider/rider');
var auth = require('basic-auth');
var distance = require('google-distance');
distance.apiKey = 'AIzaSyC8UvWs_lk9PPQcm3ehEfFpdytIE0rbHzA';

//create a single driver
router.post('/', function(req, res){
    var credentials = auth(req);
    if(!credentials || credentials.name !== 'admin' || credentials.pass !== 'secret'){
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');
    } else{
        Driver.create({
            name: req.body.name,
            availability: req.body.availability,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            DestLongitude: req.body.DestLongitude,
            DestLatitude: req.body.DestLatitude,
            totalRiders: 0,
            rating: 0,
            num_rates: 0
        },
            function( err,driver){
            if(err) return res.status(500).send("there was a problem adding the info to the database");
            res.status(200).send("access granted" + driver.name + " created.\n\n" + driver);
            });
    }
});


// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    Driver.findById(req.params.id, function (err, driver) {
        if (err) return res.status(500).send("There was a problem finding the driver.");
        if (!driver) return res.status(404).send("No driver found.");

        distance.get({
            origin: [driver.latitude + ", " + driver.longitude],
            destination: [driver.DestLatitude + ", " + driver.DestLongitude],
            mode: 'driving',
            units: 'imperial'
        },
            function(err, data){
            if(err) return console.log(err);
            if(!data) return console.log('no distance');
            console.log("\nArrival Time: " + data.duration + "\n");

            res.status(200).send("\nArrival Time: " + data.duration + "\n\n" + driver);
            });
    });
});

// Update Driver availability
router.put('/:id', function (req, res) {
    Driver.findByIdAndUpdate(req.params.id, {availability: req.body.availability}, {new: true}, function (err, driver) {
        if(driver == null) return res.status(404).send({error: "That driver doesnt exist in our database."});
        if (err) return res.status(500).send("There was a problem updating the driver.");
        res.status(200).send(driver);
    });
});

// Return all drivers in db
router.get('/', function (req, res) {
    Driver.find({}, function (err, drivers) {
        if (err) return res.status(500).send("There was a problem finding the drivers.");
        res.status(200).send(drivers);
    });
});

//Allow admin to delete drivers
router.delete('/:id', function(req, res){
    var credentials = auth(req);
    if(!credentials || credentials.name !== 'admin' || credentials.pass !== 'secret'){
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');
    }else{
        Driver.findByIdAndRemove(req.params.id, function(err, driver){
            if(err) return res.status(500).send("there was a problem deleting the driver");
            res.status(200).send("access granted. driver deleted");
        });
    }
});

//update position
router.put('/position/:id', function (req, res) {
    Driver.findByIdAndUpdate(req.params.id, {longitude: req.body.longitude, latitude: req.body.latitude}, {new: true}, function (err, driver) {
        if(driver == null) return res.status(404).send({error: "That driver doesnt exist in our database."});
        if (err) return res.status(500).send("There was a problem updating the driver.");
        res.status(200).send(driver);
    });
});

//update destination
router.put('/destination/:id', function (req, res) {
    Driver.findByIdAndUpdate(req.params.id, {DestLongitude: req.body.DestLongitude, DestLatitude: req.body.DestLatitude}, {new: true}, function (err, driver) {
        if(driver == null) return res.status(404).send({error: "That driver doesnt exist in our database."});
        if (err) return res.status(500).send("There was a problem updating the driver.");
        res.status(200).send(driver);
    });
});

//select a rider
router.put('/selectRider/:id', function (req, res) {
    Driver.findById(req.params.id, function(err,driver) {
        if (err) return res.status(500).send("there was a problem finding the driver");
        if (!driver) return res.status(404).send("no driver found.");

        driver.selectedRider = req.body.id;
        Driver.findByIdAndUpdate(req.params.id, driver, function (err, driver) {
            if(driver == null) return res.status(404).send({error: "That driver doesnt exist in our database."});
            if (err) return res.status(500).send("There was a problem updating the driver.");
            res.status(200).send(driver);
        });
    });
});

module.exports = router;
