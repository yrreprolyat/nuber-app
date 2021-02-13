// Admin.js
var mongoose = require('mongoose');
var AdminSchema = new mongoose.Schema({
    name: String
});
mongoose.model('Admin', AdminSchema);


module.exports = mongoose.model('Admin');