"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Handles MongoDB connection logic
const mong = __importStar(require("mongoose"));
const server_config_1 = require("../server.config");
//const mong = require('mongoose');
require('mongoose').Promise = global.Promise;
mong.connect(server_config_1.mongDb, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
    console.log("Connected to MongoDB at StorageBox");
})
    .catch((e) => {
    console.log("Error connecting to MongoDB collection StorageBox");
    console.log(e);
});
//Stop deprecation warnings from MongoDB native drivers
mong.set('useCreateIndex', true);
mong.set('useFindAndModify', false);
exports.mongs = mong.connection;
console.log("Past exports");
