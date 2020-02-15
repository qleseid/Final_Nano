/**
 * LOAD MONGOOSE MODELS
 */
import { Item } from '../db/models'
import express = require('express');
const mid = require('./middleware');

export const router = express.Router(); 

// const { mong } = require('../db/mongoose');

/* LOCATION ROUTES */

router.get('/all:owner', mid.authenticate, getAll);
router.get('/:id', mid.authenticate, getById);
router.post('/', mid.authenticate, _create);
router.patch('/', mid.authenticate, update);
router.delete('/:id', mid.authenticate, _delete);


/**
 * Gets simple message to show it's working from browser
 */
function getAll(req, res) 
{
    console.log("In All Item Get for: " + req.params.owner);
    Item.find({owner_id: req.params.owner}).then((item) =>
    {
        res.send(item);
    })
    .catch((e) =>
    {
        res.send(e);
    });
};

/**
 * Gets item by id
 */
function getById(req, res) 
{
    console.log("In Item GetbyId!");
    Item.findOne({_id: req.params.id}).then((item) =>
    {
        res.send(item);
    })
    .catch((e) =>
    {
        res.send(e);
    });
};

/**
 * Create an item for specific user
 */
function _create(req, res)
{
    console.log("In Item Create!");

    let newItem = new Item(req.body);
    
    Item.create(newItem).then((item) =>
    {
        res.status(200).send(item);
    })
    .catch((e) =>
    {
        res.status(400).send(e);
    });
};

/**
 * Update an item for specific user
 */
function update(req, res)
{
    console.log("In Item Update!");

    Item.findOneAndUpdate(
        {
            _id: req.body.id
        },
        {
            $set: req.body.item
        }
    )
    .then((item) =>
    {
        res.status(200).send(`Item updated with id: ${req.body.id}`);
    })
    .catch((e) =>
    {
        res.status(400).send(e);
    });
};

/**
 * Delete an item for specific user
 */
function _delete(req, res)
{
    console.log("In Item Delete!");
    Item.findOneAndRemove(
        {
            _id: req.params.id  
        })
        .then((rmDoc) => 
        {
            deleteOwnedItem(rmDoc._id);
            res.send(rmDoc);
        })
};

/***** HELPER METHOD ********/

/**
 * DELETE OWNED ITEMS
 * 
 * @param {*} id 
 */
let deleteOwnedItem = (owner_id) =>
{
    console.log("In Delete Owner Items!");
    Item.deleteMany(
        {
            owner_id
        }).then(() =>
        {
            console.log(`Items owned by ${owner_id} were deleted!`);
        });
}
