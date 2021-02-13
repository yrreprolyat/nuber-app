//AdminController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Admin = require('./admin');

router.post('/', function (req, res){
    Admin.create({
            name: req.body.name
    },
    function (err, admin){
        if(err) return res.status(500).send("there was a problem adding the admin to the db");
        res.status(200).send(admin);
    });
});

router.get('/', function (req, res){
    Admin.find({}, function ( err, admins){
        if (err) return res.status(500).send("There was a problem finding the admins.");
        res.status(200).send(admins);
    });
});

router.get('/:id', function (req, res){
    Admin.findById(req.params.id, function( err, admin){
        if (err) return res.status(500).send("There was a problem finding the admin.");
        if (admin == null) return res.status(404).send("No admin found.");
        res.status(200).send(admin);
    });
});

router.delete('/:id', function (req, res){
    Admin.findByIdAndRemove(req.params.id, function(err, admin){
        if (err) return res.status(500).send("There was a problem deleting the admin.");
        res.status(200).send("Admin: " + admin.name + " was deleted.");
    });
});

router.put('/:id', function( req, res){
    Admin.findByIdAndUpdate(req.param.id, req.body, {new: true}, function (err, admin){
        if(err) return res.status(500).send("There was a problem updating the admin.");
        res.status(200).send(admin);
    });
});

module.exports = router;