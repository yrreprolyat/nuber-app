// db.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://dbuser:Password123@cluster0-shard-00-00-vbpsj.mongodb.net:27017,cluster0-shard-00-01-vbpsj.mongodb.net:27017,cluster0-shard-00-02-vbpsj.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', { useNewUrlParser: true });