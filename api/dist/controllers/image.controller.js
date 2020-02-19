"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../db/models");
const multer_1 = __importDefault(require("multer"));
const express = require("express");
const mid = require('./middleware');
const DIR = "./uploads";
exports.router = express.Router();
// const upload = multer({dest: DIR});
console.log("In Image: " + DIR);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: function (req, file, cb) {
        // null as first argument means no error
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer_1.default({ storage: storage });
/* LOCATION ROUTES */
exports.router.get('/upload', mid.authenticate, getAll);
exports.router.get('/upload', mid.authenticate, getById);
exports.router.post('/upload', upload.single('photo'), _create);
exports.router.patch('/upload', mid.authenticate, update);
exports.router.delete('/upload', mid.authenticate, _delete);
/**
 * Find all the items owned by specific id
 */
function getAll(req, res) {
    console.log("In All Item Get for: " + req.params.id);
    console.log("Params: " + req.params.id);
    models_1.Item.find({ owner_id: req.params.id }, (err, items) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(items);
        }
    });
}
;
/**
 * Gets single item by id
 */
function getById(req, res) {
    console.log("In Item GetbyId!");
    models_1.Item.findById(req.params.id, (err, item) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(item);
        }
    });
}
;
/**
 * Create/save an item for specific user
 */
function _create(req, res) {
    console.log("In Image Create!");
    /*if (!req.file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
      }
        res.send(req.file)
    
        upload(req, res, (err) => {
            if (err){
                res.status(411).send(err);
            }
            else
            {
                // If file is not selected
                if (req.file == undefined)
                {
                    res.status(410).send("No file selected!");
                }
                else
                {
                    res.status(200).send ("File uploaded successfully!");
                }
            }
        
        });
        */
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });
    }
    else {
        console.log('file received');
        return res.send({
            success: true
        });
    }
}
;
/**
 * Update an item for specific user
 */
function update(req, res) {
    console.log("In Item Update!");
    models_1.Item.findOneAndUpdate(req.body.id, { $set: req.body.item }, (err, item) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send(`Item updated with id: ${req.body.id}`);
        }
    });
}
;
/**
 * Delete an item for specific user
 */
function _delete(req, res) {
    console.log("In Item Delete!");
    models_1.Item.findByIdAndDelete(req.params.id, (err, rmDoc) => {
        if (err) {
            res.send(err);
        }
        else {
            deleteOwnedItem(rmDoc._id);
            res.send(rmDoc);
        }
    });
}
;
/***** HELPER METHOD ********/
/**
 * DELETE OWNED ITEMS
 *
 * @param {*} id
 */
let deleteOwnedItem = (owner_id) => {
    console.log("In Delete Owner Items!");
    models_1.Item.deleteMany(owner_id, (err) => {
        if (err) {
            console.log(`Items owned by ${owner_id} FAILED to delete!`);
        }
        else {
            console.log(`Items owned by ${owner_id} were deleted!`);
        }
    });
};
