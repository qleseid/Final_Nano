"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * LOAD MONGOOSE MODELS
 */
const models_1 = require("../db/models");
const express = require("express");
const mid = require('./middleware');
exports.router = express.Router();
// const { mong } = require('../db/mongoose');
/* LOCATION ROUTES */
exports.router.get('/all:owner', mid.authenticate, getAll);
exports.router.get('/:id', mid.authenticate, getById);
exports.router.post('/', mid.authenticate, _create);
exports.router.patch('/', mid.authenticate, update);
exports.router.delete('/:id', mid.authenticate, _delete);
/**
 * Gets simple message to show it's working from browser
 */
function getAll(req, res) {
    console.log("In All Item Get for: " + req.params.owner);
    models_1.Item.find({ owner_id: req.params.owner }).then((item) => {
        res.send(item);
    })
        .catch((e) => {
        res.send(e);
    });
}
;
/**
 * Gets item by id
 */
function getById(req, res) {
    console.log("In Item GetbyId!");
    models_1.Item.findOne({ _id: req.params.id }).then((item) => {
        res.send(item);
    })
        .catch((e) => {
        res.send(e);
    });
}
;
/**
 * Create an item for specific user
 */
function _create(req, res) {
    console.log("In Item Create!");
    let newItem = new models_1.Item(req.body);
    models_1.Item.create(newItem).then((item) => {
        res.status(200).send(item);
    })
        .catch((e) => {
        res.status(400).send(e);
    });
}
;
/**
 * Update an item for specific user
 */
function update(req, res) {
    console.log("In Item Update!");
    models_1.Item.findOneAndUpdate({
        _id: req.body.id
    }, {
        $set: req.body.item
    })
        .then((item) => {
        res.status(200).send(`Item updated with id: ${req.body.id}`);
    })
        .catch((e) => {
        res.status(400).send(e);
    });
}
;
/**
 * Delete an item for specific user
 */
function _delete(req, res) {
    console.log("In Item Delete!");
    models_1.Item.findOneAndRemove({
        _id: req.params.id
    })
        .then((rmDoc) => {
        deleteOwnedItem(rmDoc._id);
        res.send(rmDoc);
    });
}
;
/***** HELPER METHOD ********/
/**
 * DELETE OWNED ITEMS
 *
 * @param {*} id
 */
let deleteOwnedItem = (owner_id) => {
    console.log("In Delete Owner Items!");
    models_1.Item.deleteMany({
        owner_id
    }).then(() => {
        console.log(`Items owned by ${owner_id} were deleted!`);
    });
};
