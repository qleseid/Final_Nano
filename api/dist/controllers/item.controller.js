"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../db/models");
const express = require("express");
const mid = require('./middleware');
exports.router = express.Router();
/* LOCATION ROUTES */
exports.router.get('/:id/all', mid.authenticate, getAll);
exports.router.get('/:id', mid.authenticate, getById);
exports.router.post('/', mid.authenticate, _create);
exports.router.patch('/', mid.authenticate, update);
exports.router.delete('/:id', mid.authenticate, _delete);
/**
 * Find all the items owned by specific id
 */
function getAll(req, res) {
    console.log("In All Item Get for: " + req.params.id);
    console.log("Params: " + req.params.id);
    models_1.Item.find({ owner_id: req.params.id }, (err, items) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(items);
        }
    });
}
;
/**
 * Gets single item by id
 */
function getById(req, res) {
    console.log("In Item GetbyId!");
    models_1.Item.findById(req.params.id, (err, item) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(item);
        }
    });
}
;
/**
 * Create/save an item for specific user
 */
function _create(req, res) {
    console.log("In Item Create!");
    let newItem = new models_1.Item(req.body);
    models_1.Item.create(newItem, (err, item) => {
        if (err) {
            res.status(407).send(err);
        }
        else {
            res.status(200).send(item);
        }
    });
}
;
/**
 * Update an item for specific user
 */
function update(req, res) {
    console.log("In Item Update!");
    models_1.Item.findOneAndUpdate(req.body.id, { $set: req.body.item }, (err, item) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send(`Item updated with id: ${req.body.id}`);
        }
    });
}
;
/**
 * Delete an item for specific user
 */
function _delete(req, res) {
    console.log("In Item Delete!");
    models_1.Item.findByIdAndDelete(req.params.id, (err, rmDoc) => {
        if (err) {
            res.send(err);
        }
        else {
            deleteOwnedItem(rmDoc._id);
            res.send(rmDoc);
        }
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
    models_1.Item.deleteMany(owner_id, (err) => {
        if (err) {
            console.log(`Items owned by ${owner_id} FAILED to delete!`);
        }
        else {
            console.log(`Items owned by ${owner_id} were deleted!`);
        }
    });
};
