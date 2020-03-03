import { IItemInterface, ItemSchema } from './../db/models/item.model';
import { Item } from '../db/models'
import express = require('express');
import { upload, deleteImage } from './image.controller';
import { ObjectID } from 'mongodb';

const mid = require('./middleware');
export const router = express.Router(); 

/* LOCATION ROUTES */

router.get('/:id/all', mid.authenticate, getAll);
router.get('/:id', mid.authenticate, getById);
router.post('/', mid.authenticate, upload.single("photo"), _create);
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
    console.log(req.body.title);
    console.log(req.body);
    
    const url = req.protocol + "://" + req.get('host') + "/";
    console.log("URL: " + url);

    if (!req.file) 
    {
        console.log("No file received");
        return res.status(400).send(
            {
                success: false
            });
    }
    else
    {
        console.log(req.file);
        console.log("file received: " + req.file.path + " | " + req.file.filename);

        let newItem = new Item(
            {
                owner_id: req.body.owner_id,
                title: req.body.title,
                description: req.body.description,
                file_path: `${url}${req.file.filename}`
            });

        console.log(newItem);

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
    }    
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
                deleteImage(rmDoc.file_path);
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
let deleteOwnedItem = (owner_id: ObjectID) =>
{
    const strId = owner_id.toString();

    console.log("In Delete Owner Items!");
    Item.deleteMany(
        { owner_id: strId },
        (err: any) =>
        {
            if (err)
            {
                console.log(`Items owned by ${owner_id} FAILED to delete!`);
                console.log(err);
            }
            else
            {
                console.log(`Items owned by ${owner_id} were deleted!`);
            }
        });
};
