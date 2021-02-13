// RiderController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Rider = require('./rider');
var Driver = require('../driver/Driver');
const distanceAPIKey = 'AIzaSyC8UvWs_lk9PPQcm3ehEfFpdytIE0rbHzA';
const https = require('https');

//create a rider
router.post('/', function (req, res) {
    Rider.create({
            name : req.body.name,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            totalRides: 0,
            rating: 0,
            reports: 0
        },
        function (err, rider) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(rider);
        });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    Rider.findById(req.params.id, function (err, rider) {
        if (err) return res.status(500).send("There was a problem finding the rider.");
        if (!rider) return res.status(404).send("No rider found.");
        res.status(200).send(user);
    });
});

//update location
router.put('/location/:id', function (req, res) {
    Rider.findByIdAndUpdate(req.params.id, {longitude: req.body.longitude, latitude: req.body.latitude}, {new: true}, function (err, rider) {
        if(rider == null) return res.status(404).send({error: "That rider doesnt exist in our database."});
        if (err) return res.status(500).send("There was a problem updating the rider.");
        res.status(200).send(rider);
    });
});


// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    Rider.findByIdAndUpdate(req.params.id, {availability: req.body.availability}, {new: true}, function (err, rider) {
        if(rider == null) return res.status(404).send({error: "That rider doesnt exist in our database."});
        if (err) return res.status(500).send("There was a problem updating the rider.");
        res.status(200).send(rider);
    });
});

// UPDATES A SINGLE USER REPORT RATING IN THE DATABASE DELETES IF TOO MANY REPORTS
router.put('/report/:id', function (req, res) {
    Rider.findByIdAndUpdate(req.params.id, {$inc: {reports: 1}}, function (err, rider) {
        if(rider == null) return res.status(404).send({error: "That rider doesnt exist in our database."});
        if (err) return res.status(500).send("There was a problem updating the rider.");
        if(rider.reports === 3){
          console.log("this man is banned");
          Rider.findByIdAndRemove(req.params.id, function(err, rider){
              if (err) return res.status(500).send("There was a problem deleting the rider.");
              res.status(200).send("Rider deleted.");
          });
        }
        res.status(200).send("Rider reported");
    });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    Rider.find({}, function (err, riders) {
        if (err) return res.status(500).send("There was a problem finding the riders.");
        res.status(200).send(riders);
    });
});

// get nearby drivers
router.get('/near/:id', function (req, res){ 
    Rider.findById(req.params.id, function (err, rider) {

        var mapsAPI;
        var distanceDiff;
        var obj = [];
        
        Driver.find({}, function (err, drivers){
            drivers.forEach(element => { // looks at each driver
                if(element.longitude === undefined){ // skips if there is no location data
                    return
                }
                if(element.latitude === undefined){
                    return
                }

                mapsAPI = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + rider.longitude + "," + rider.latitude + "&destinations=" + element.longitude + "," + element.latitude + "&key=" + distanceAPIKey;
                var body = "";
                https.get(mapsAPI, (res) => { // calls google maps api ^
                    res.on('data', data => {
                        body += data;
                    });
                    res.on("end", () => {
                        body = JSON.parse(body); 
                        distanceDiff = body.rows[0].elements[0].status // parse api get to only the distance value
                        //console.log(distanceDiff);
                    });
                });

                if(distanceDiff <= 10){ // sees if distance is less than 10 miles
                    console.log(element.name);
                    console.log("driver in range");
                    obj.push(element); // pushes driver onto object if in range
                }
                else{
                    console.log(element.name);
                    console.log("driver not in range");
            
                }
                
            });
           res.status(200).send(obj);
        });
    
    });
    
});


//delete a rider
router.delete('/:id', function(req, res){
    Rider.findByIdAndRemove(req.params.id, function(err, rider){
        if (err) return res.status(500).send("There was a problem deleting the rider.");
        res.status(200).send("Rider deleted.");
    });
});

//set destination
router.put('/destination/:id', function (req, res) {
    Rider.findByIdAndUpdate(req.params.id, {destinationLongitude: req.body.destinationLongitude, destinationLatitude: req.body.destinationLatitude}, {new: true}, function (err, rider) {
        if(rider == null) return res.status(404).send({error: "That rider doesnt exist in our database."});
        if (err) return res.status(500).send("There was a problem updating the rider.");
        res.status(200).send(rider);
    });
});

//adds common rider destinations
router.put('/add_common_destination/:id', function (req, res) {
    Rider.findById(req.params.id, function (err, rider) {
        if(rider == null) return res.status(404).send({error: "That rider doesnt exist in our database."});
        if (err) return res.status(500).send("There was a problem updating the rider.");

        rider.common_destinations.push(req.body.new_common_destination);
        rider.common_coordinates_lat.push(req.body.new_common_lat);
        rider.common_coordinates_long.push(req.body.new_common_long);
        Rider.findByIdAndUpdate(req.params.id, rider, function (err, rider) {
            if(rider == null) return res.status(404).send({error: "That rider doesnt exist in our database."});
            if (err) return res.status(500).send("There was a problem updating the rider.");
            res.status(200).send(rider);
        });
    });
});

// Update Driver rating
router.put('/rateDriver/:id', function (req, res) {
      Driver.findById(req.params.id, function(err,driver){
        if(err) return res.status(500).send("there was a problem finding the driver");
        if(!driver) return res.status(404).send("no driver found.");

        //rating calculation here
        var old_rating = driver.rating;
        var old_num_rates = driver.num_rates;
        var new_rating = req.body.rating;
        driver.rating = ((old_rating * old_num_rates) + new_rating) / (old_num_rates + 1);
        driver.num_rates = old_num_rates + 1;
        Driver.findByIdAndUpdate(req.params.id, driver, function (err, driver) {
            if(driver == null) return res.status(404).send({error: "That driver doesnt exist in our database."});
            if (err) return res.status(500).send("There was a problem updating the driver.");
            res.status(200).send(driver);
        });

    });
});

//select a driver
router.put('/selectDriver/:id', function (req, res) {
    Rider.findById(req.params.id, function(err,rider) {
        if (err) return res.status(500).send("there was a problem finding the rider");
        if (!rider) return res.status(404).send("no rider found.");

        rider.selectedDriver = req.body.id;
        Rider.findByIdAndUpdate(req.params.id, rider, function (err, rider) {
            if(rider == null) return res.status(404).send({error: "That rider doesnt exist in our database."});
            if (err) return res.status(500).send("There was a problem updating the rider.");
            res.status(200).send(rider);
        });
    });
});

module.exports = router;
