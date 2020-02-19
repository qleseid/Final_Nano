import { IItemInterface, ItemSchema } from './../db/models/item.model';
import { Item } from '../db/models'
import express = require('express');

const mid = require('./middleware');
export const router = express.Router(); 

/* LOCATION ROUTES */

router.get('/:id/all', mid.authenticate, getAll);
router.get('/:id', mid.authenticate, getById);
router.post('/', mid.authenticate, _create);
router.patch('/', mid.authenticate, update);
router.delete('/:id', mid.authenticate, _delete);


/**
 * Find all the items owned by specific id
 */
function getAll(req: any, res: any) 
{
    console.log("In All Item Get for: " + req.params.id);
    console.log("Params: " + req.params.id);

    Item.find(
        {owner_id: req.params.id},
        (err: any, items: IItemInterface) =>
    {
        if (err)
        {
            res.send(err);
        }
        else
        {
            res.send(items);
        }
    });
};

/**
 * Gets single item by id
 */
function getById(req: any, res: any) 
{
    console.log("In Item GetbyId!");

    Item.findById(
        req.params.id,
        (err: any, item: any) =>
    {
        if (err)
        {
            res.send(err);
        }
        else
        {
            res.send(item);
        }
    });
};

/**
 * Create/save an item for specific user
 */
function _create(req: any, res: any)
{
    console.log("In Item Create!");

    let newItem = new Item(req.body);
    
    Item.create(
        newItem,
        (err: any, item: any) =>
    {
        if (err)
        {
            res.status(407).send(err);
        }
        else
        {
            res.status(200).send(item);
        }
    });
};

/**
 * Update an item for specific user
 */
function update(req: any, res: any)
{
    console.log("In Item Update!");

    Item.findOneAndUpdate(
        req.body.id,
        {$set: req.body.item},
        (err: any, item: any) =>
    {
        if (err)
        {
            res.status(400).send(err);
        }
        else
        {
            res.status(200).send(`Item updated with id: ${req.body.id}`);
        }        
    });
};

/**
 * Delete an item for specific user
 */
function _delete(req: any, res: any)
{
    console.log("In Item Delete!");
    Item.findByIdAndDelete(
        req.params.id,
        (err: any, rmDoc: any) => 
        {
            if (err)
            {
                res.send(err);
            }
            else
            {
                deleteOwnedItem(rmDoc._id);
                res.send(rmDoc);
            }
        });
};

/***** HELPER METHOD ********/

/**
 * DELETE OWNED ITEMS
 * 
 * @param {*} id 
 */
let deleteOwnedItem = (owner_id: any) =>
{
    console.log("In Delete Owner Items!");
    Item.deleteMany(
        owner_id,
        (err: any) =>
        {
            if (err)
            {
                console.log(`Items owned by ${owner_id} FAILED to delete!`);
            }
            else
            {
                console.log(`Items owned by ${owner_id} were deleted!`);
            }
        });
};
