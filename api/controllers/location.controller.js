"use strict";
exports.__esModule = true;
/**
 * LOAD MONGOOSE MODELS
 */
var index_1 = require("./../db/models/index");
var express = require("express");
exports.router = express.Router();
// const { mong } = require('../db/mongoose');
/* LOCATION ROUTES */
exports.router.get('/all', getAll);
exports.router.get('/', get);
exports.router.post('/', create);
exports.router.patch('/:id', update);
exports.router["delete"]('/:id', _delete);
/**
 * Gets simple message to show it's working from browser
 */
function getAll(req, res) {
    console.log("In Location Get!");
    res.json({ "message": "Welcome to Location API."
    });
}
;
/**
 * Gets all the locations in db
 */
function get(req, res) {
    console.log("In User Location Get!");
    index_1.Item.find().then(function (loca) {
        res.send(loca);
    })["catch"](function (e) {
        res.send(e);
    });
}
;
/**
 * Create new location for specific user
 */
function create(req, res) {
    console.log("In Create!");
    var owner_id = req.body.owner_id;
    var title = req.body.title;
    var file_path = req.body.file_path;
    var description = req.body.description;
    var newLoca = new index_1.Item({
        owner_id: owner_id,
        title: title,
        file_path: file_path,
        description: description
    });
    newLoca.save().then(function (list) {
        res.send(list);
    });
}
;
/**
 * Update a location for specific user
 */
function update(req, res) {
    index_1.Item.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    })
        .then(function () {
        res.sendStatus(200);
    });
}
;
/**
 * Delete a location for specific user
 */
function _delete(req, res) {
    index_1.Item.findOneAndRemove({
        _id: req.params.id
    })
        .then(function (rmDoc) {
        res.send(rmDoc);
    });
}
;
