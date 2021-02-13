// Driver.js
var mongoose = require('mongoose');
var DriverSchema = new mongoose.Schema({
    name: String,
    availability: Boolean,
    longitude: Number,
    latitude: Number,
    DestLongitude: Number,
    DestLatitude: Number,
    totalRiders: Number,
    rating: Number,
    num_rates: Number,
    selectedRider: String
});
mongoose.model('Driver', DriverSchema);


module.exports = mongoose.model('Driver');
