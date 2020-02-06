/**
 * LOAD MONGOOSE MODELS
 */
const { Location } = require('./../db/models');
const express = require('express');
const router = express.Router(); 

// const { mong } = require('../db/mongoose');
/* LOCATION ROUTES */

router.get('/all', getAll);
router.get('/', get);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

/**
 * Gets simple message to show it's working from browser
 */
function getAll(req, res) 
{
    console.log("In Location Get!");
    res.json(
        {"message":
         "Welcome to Location API."
        }); 
};


/**
 * Gets all the locations in db
 */
function get(req, res) 
{
    console.log("In User Location Get!");
    Location.find().then((loca) =>
    {
        res.send(loca);
    })
    .catch((e) =>
    {
        res.send(e);
    });
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
    Location.findOneAndUpdate({_id: req.params.id}, 
        {
            $set: req.body
        })
        .then(() => 
        {
            res.sendStatus(200);
        })
};

/**
 * Delete a location for specific user
 */
function _delete(req, res)
{
    Location.findOneAndRemove(
        {
            _id: req.params.id  
        })
        .then((rmDoc) => 
        {
            res.send(rmDoc);
        })
};