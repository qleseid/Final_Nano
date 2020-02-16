"use strict";
exports.__esModule = true;
//Model of storage locations
var mongoose_1 = require("mongoose");
exports.ItemSchema = new mongoose_1.Schema({
    // _id: mong.Schema.Types.ObjectId,
    owner_id: {
        // type: mong.Schema.Types.ObjectId,
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    file_path: {
        type: String,
        "default": "empty.jpg"
    },
    description: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        "default": Date.now
    }
});
exports["default"] = mongoose_1.model('Item', exports.ItemSchema);
