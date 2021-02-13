// Rider.js
var mongoose = require('mongoose');
var RiderSchema = new mongoose.Schema({
    name: String,
    longitude: Number,
    latitude: Number,
    totalRides: Number,
    rating: Number,
    destinationLongitude: Number,
    destinationLatitude: Number,
    reports: Number,
    selectedDriver: String,
    common_destinations: [String],
    common_coordinates_lat: [Number],
    common_coordinates_long: [Number]
});
mongoose.model('Rider', RiderSchema);


module.exports = mongoose.model('Rider');
