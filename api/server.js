"use strict";
exports.__esModule = true;
// const cors = require('cors');
var location_controller_1 = require("./controllers/location.controller");
var login_controller_1 = require("./controllers/login.controller");
var user_controller_1 = require("./controllers/user.controller");
var item_controller_1 = require("./controllers/item.controller");
var bodyParser = require("body-parser");
var mongoose_1 = require("./db/mongoose");
var express = require("express");
// import jwt from 'express-jwt';
var port = process.env.NODE_ENV === 'production' ? 80 : 3000;
var app = express();
mongoose_1.mongs.once('open', function () {
    console.log("Connected");
});
/** MIDDLEWARE**/
/**
 * LOAD MIDDLEWARE
 */
//app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');
    next();
});
/** END OF MIDDLEWARE **/
/************* ROUTE HANDLERS *******************/
app.use('/loca', location_controller_1.router);
app.use('/', login_controller_1.router);
app.use('/users', user_controller_1.router);
app.use('/item', item_controller_1.router);
// error handler
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid Token Bitch');
    }
    else {
        throw err;
    }
});
/**
 * LISTEN
 * PORT: 3000
 *
 * Port the server listens for requests on
 */
app.listen(port, function () {
    console.log("Server running and listening on port " + port);
});
