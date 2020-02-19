import { IItemInterface, ItemSchema } from './../db/models/item.model';
import { Item } from '../db/models'
import multer from "multer";
import path from "path";
import express = require('express');

const mid = require('./middleware');

const DIR = "./uploads";
export const router = express.Router(); 

// const upload = multer({dest: DIR});

console.log("In Image: " + DIR);

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) =>
	{
		cb(null, DIR)
	},
    filename: function (req, file, cb) {        
        // null as first argument means no error
        cb(null, Date.now() + '-' + file.originalname )
    }
});

const upload = multer({storage: storage});

    
/* LOCATION ROUTES */


router.get('/upload', mid.authenticate, getAll);
router.get('/upload', mid.authenticate, getById);
router.post('/upload', upload.single('photo'), _create);
router.patch('/upload', mid.authenticate, update);
router.delete('/upload', mid.authenticate, _delete);


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
    if (!req.file) 
    {
        console.log("No file received");
        return res.send(
            {
                success: false
            });
    }
    else
    {
        console.log('file received');
        return res.send(
            {
                success: true
            })
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
