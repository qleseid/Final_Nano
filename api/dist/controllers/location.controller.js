"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * LOAD MONGOOSE MODELS
 */
const index_1 = require("./../db/models/index");
const express = __importStar(require("express"));
exports.router = express.Router();
// const { mong } = require('../db/mongoose');
/* LOCATION ROUTES */
exports.router.get('/all', getAll);
exports.router.get('/', get);
exports.router.post('/', create);
exports.router.patch('/:id', update);
exports.router.delete('/:id', _delete);
/**
 * Gets simple message to show it's working from browser
 */
function getAll(req, res) {
    console.log("In Location Get!");
    res.json({ "message": "Welcome to Location API."
    });
}
;
/**
 * Gets all the locations in db
 */
function get(req, res) {
    console.log("In User Location Get!");
    index_1.Item.find().then((loca) => {
        res.send(loca);
    })
        .catch((e) => {
        res.send(e);
    });
}
;
/**
 * Create new location for specific user
 */
function create(req, res) {
    console.log("In Create!");
    let owner_id = req.body.owner_id;
    let title = req.body.title;
    let file_path = req.body.file_path;
    let description = req.body.description;
    let newLoca = new index_1.Item({
        owner_id,
        title,
        file_path,
        description
    });
    newLoca.save().then((list) => {
        res.send(list);
    });
}
;
/**
 * Update a location for specific user
 */
function update(req, res) {
    index_1.Item.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    })
        .then(() => {
        res.sendStatus(200);
    });
}
;
/**
 * Delete a location for specific user
 */
function _delete(req, res) {
    index_1.Item.findOneAndRemove({
        _id: req.params.id
    })
        .then((rmDoc) => {
        res.send(rmDoc);
    });
}
;
