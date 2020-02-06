
/**
 * LOAD MONGOOSE MODELS
 */
const { Login } = require('../db/models');
const { Location } = require('../db/models');

const express = require('express');
const router = express.Router(); 

// const { mong } = require('../db/mongoose');

/* LOCATION ROUTES */

router.get('/', getUserLocation);
router.post('/loca', create);
router.patch('/loca:id', update);
router.delete('/loca:id', _delete);

module.exports = router;

/**
 * Gets all the locations for specific user
 */
function getUserLocation(req, res) 
{
    console.log("In Login Get!");
    res.json(
        {"message":
         "Welcome to Login API."
        });
        /*
    Location.find().then((loca) =>
    {
        res.send(loca);
    })
    .catch((e) =>
    {
        res.send(e);
    });
    */
};

/**
 * Create new location for specific user
 */
function create(req, res)
{
    console.log("In Create!");

    let owner_id = req.body.owner_id;
    let title = req.body.title;
    let file_path = req.body.file_path;
    let description = req.body.description;

    let newLoca = new Location(
        {
            owner_id,
            title,
            file_path,
            description
        }
    );

    newLoca.save().then((list) => 
    {
        res.send(list);
    });
};

/**
 * Update a location for specific user
 */
function update(req, res)
{
    
    res.send("Hello World");
};

/**
 * Delete a location for specific user
 */
function _delete(req, res)
{
    res.send("Hello World");
};