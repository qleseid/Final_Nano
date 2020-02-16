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
exports.router.get('/me/access-token', mid.verify, auth);
exports.router.get('/all', mid.authenticate, getAll);
exports.router.get('/:id', mid.authenticate, getById);
exports.router.delete('/:id', mid.authenticate, _delete);
/** AUTHENTICATE
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
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
    models_1.User.find().then((loca) => {
        res.send(loca);
    })
        .catch((e) => {
        res.send(e);
    });
}
;
/**
 * Gets user by id
 */
function getById(req, res) {
    console.log("In User Get!");
    models_1.User.findOne({ _id: req.params.id }).then((user) => {
        res.send(user);
    })
        .catch((e) => {
        res.send(e);
    });
}
;
/**
 * Delete a location for specific user
 */
function _delete(req, res) {
    models_1.User.findOneAndRemove({
        _id: req.params.id
    })
        .then((rmDoc) => {
        res.send(rmDoc);
    });
}
;
