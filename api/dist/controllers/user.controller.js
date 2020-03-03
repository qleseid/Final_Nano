"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../db/models");
const express = require("express");
const mid = require('./middleware');
exports.router = express.Router();
/* LOCATION ROUTES */
exports.router.get('/me/access-token', mid.verify, auth);
exports.router.get('/all', mid.authenticate, getAll);
exports.router.get('/:id', mid.authenticate, getById);
exports.router.delete('/:id', mid.authenticate, _delete);
/** AUTHENTICATE
 *
 */
function auth(req, res) {
    console.log("In User Auth!");
    //User is authenticated, user_id and user object available
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    })
        .catch((e) => {
        res.status(400).send(e);
    });
}
/**
 * Gets simple message to show it's working from browser
 */
function getAll(req, res) {
    console.log("In All User Get!");
    models_1.User.find((err, users) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(users);
        }
    });
}
;
/**
 * Gets user by id
 */
function getById(req, res) {
    console.log("In User Get!");
    models_1.User.findById(req.params.id, (err, user) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(user);
        }
    });
}
;
/**
 * Delete a location for specific user
 */
function _delete(req, res) {
    models_1.User.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Successfully Deleted User");
        }
    });
}
;
