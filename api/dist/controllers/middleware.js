"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../db/models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verify = function (req, res, next) {
    console.log("In Middle verify!");
    //Get refresh token out of header
    let refreshToken = req.header('x-refresh-token');
    //Get _id from header
    let _id = req.header('_id');
    let users = new models_1.User();
    //console.log("Found ID: " + _id);
    //console.log("Found ID: " + req.query._id);
    //console.log("Found token: " + req.query.xrefreshtoken);
    //console.log("Found token: " + refreshToken);
    models_1.User.findByIdAndToken(_id, refreshToken).then((user) => {
        //console.log("Found user Token: " + user.sessions[0].token);
        //console.log("Found RefreshToken: " + refreshToken);
        if (!user) {
            return Promise.reject({
                "error": "User not found! Ensure token and id are correct"
            });
        }
        //User was found if this is reached
        //Valid session
        req.user_id = user._id;
        users = user;
        req.userObject = users;
        req.refreshToken = refreshToken;
        //console.log("user: " + user);
        //console.log("userObject: " + req.userObject);
        let isSessionValid = false;
        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                if (models_1.User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    isSessionValid = true;
                }
            }
        });
        //Session expire check
        if (isSessionValid) {
            next(); //Valid session, continue on with request
        }
        else {
            return Promise.reject({
                "error": "Refresh token has expired or invalid session"
            });
        }
    })
        .catch((e) => {
        res.status(401).send(e);
    });
};
// check whether the request has a valid JWT access token
exports.authenticate = function (req, res, next) {
    console.log("In Middle authenticate!");
    let token = req.header('x-access-token');
    // verify the JWT
    jsonwebtoken_1.default.verify(token, models_1.User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        }
        else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });
};
