"use strict";
exports.__esModule = true;
// Handles MongoDB connection logic
var mong = require("mongoose");
var server_config_1 = require("../server.config");
//const mong = require('mongoose');
require('mongoose').Promise = global.Promise;
mong.connect(server_config_1.mongDb, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(function () {
    console.log("Connected to MongoDB at StorageBox");
})["catch"](function (e) {
    console.log("Error connecting to MongoDB collection StorageBox");
    console.log(e);
});
//Stop deprecation warnings from MongoDB native drivers
mong.set('useCreateIndex', true);
mong.set('useFindAndModify', false);
exports.mongs = mong.connection;
console.log("Past exports");
