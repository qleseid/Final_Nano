"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const cors = require('cors');
const location_controller_1 = require("./controllers/location.controller");
const login_controller_1 = require("./controllers/login.controller");
const user_controller_1 = require("./controllers/user.controller");
const item_controller_1 = require("./controllers/item.controller");
const bodyParser = require("body-parser");
const mongoose_1 = require("./db/mongoose");
const express = require("express");
// import jwt from 'express-jwt';
const port = process.env.NODE_ENV === 'production' ? 80 : 3000;
const app = express();
mongoose_1.mongs.once('open', () => {
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
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}`);
});
