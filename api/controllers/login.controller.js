"use strict";
exports.__esModule = true;
/**
 * LOAD MONGOOSE MODELS
 */
var models_1 = require("../db/models");
//const { User } = require('../db/models');
//const { Login } = require('../db/models');
//const { Location } = require('../db/models');
var Q = require("q");
var express = require("express");
exports.router = express.Router();
// const { mong } = require('../db/mongoose');
/* LOCATION ROUTES */
exports.router.post('/make', _create);
exports.router.post('/login', login);
/**
 * Create new user
 */
function _create(req, res) {
    console.log("In Login-Create User!");
    var username = req.body.username;
    var newUser = new models_1.User(req.body);
    checkUser(username)
        .then(function () {
        models_1.User.create(newUser).then(function () {
            return newUser.createSession();
        })
            .then(function (refreshToken) {
            //Session created with success. Refresh token returned
            return newUser.generateAccessAuthToken().then(function (accessToken) {
                return { accessToken: accessToken, refreshToken: refreshToken };
            });
        })
            .then(function (authToken) {
            res
                .header('x-refresh-token', authToken.refreshToken)
                .header('x-access-token', authToken.accessToken)
                .send(newUser);
        })["catch"](function (e) {
            console.log("Inside Reg Cre" + e);
            res.status(400).send("" + e);
        });
    })["catch"](function (e) {
        console.log("Inside _Create" + e);
        res.status(418).send("" + e);
    });
}
;
/**
 *    LOGIN
 *
 * @param {*} req
 * @param {*} res
 */
function login(req, res) {
    console.log("In Login!");
    var username = req.body.username;
    var password = req.body.password;
    models_1.User.findByCredentials(username, password).then(function (user) {
        return user.createSession().then(function (refreshToken) {
            return user.generateAccessAuthToken().then(function (accessToken) {
                return { accessToken: accessToken, refreshToken: refreshToken };
            });
        })
            .then(function (authToken) {
            res
                .header('x-refresh-token', authToken.refreshToken)
                .header('x-access-token', authToken.accessToken)
                .send(user);
        });
    })["catch"](function (e) {
        console.log("" + e);
        res.status(400).send("" + e);
    });
}
;
/**
 * CHECK FOR USER
 *
 * @param body
 */
function checkUser(username) {
    var def = new Q.defer();
    console.log("In Check User!");
    models_1.User.findOne({ username: username }, function (err, user) {
        console.log("In Check User FindOne!");
        if (err) {
            console.log("In Check User Error!");
            def.reject(new Error("Error checking user"));
        }
        if (user) {
            console.log("In Check User Found user error!");
            def.reject(new Error("Username " + username + " already exists"));
        }
        else {
            console.log("In Check User resolve!");
            def.resolve();
        }
    });
    return def.promise;
}
