"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
exports.ItemSchema = new mongoose.Schema({
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
        default: "empty.jpg"
    },
    description: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose.model('Item', exports.ItemSchema);
