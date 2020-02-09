/**
 * LOAD MONGOOSE MODELS
 */
const { User } = require('./../db/models');
const express = require('express');
const router = express.Router(); 
const mid = require('./middleware');


// const { mong } = require('../db/mongoose');

/* LOCATION ROUTES */

router.get('/me/access-token', mid.verify, auth);
router.get('/all', mid.authenticate, getAll);
router.get('/:id', mid.authenticate, getById);
// router.patch('/:id', mid.authenticate, update);
// router.delete('/:id', mid.authenticate, _delete);

module.exports = router;

/** AUTHENTICATE
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function auth(req, res)
{
    console.log("In User Auth!");
		
    //User is authenticated, user_id and user object available
    req.userObject.generateAccessAuthToken().then((accessToken) =>
    {
        res.header('x-access-token', accessToken).send({accessToken});
    })
    .catch((e) =>
    {
        res.status(400).send(e);
    });
}

/**
 * Gets simple message to show it's working from browser
 */
function getAll(req, res) 
{
    console.log("In All User Get!");
    User.find().then((loca) =>
    {
        res.send(loca);
    })
    .catch((e) =>
    {
        res.send(e);
    });
};


/**
 * Gets user by id
 */
function getById(req, res) 
{
    console.log("In User Get!");
    User.findOne({_id: req.params.id}).then((user) =>
    {
        res.send(user);
    })
    .catch((e) =>
    {
        res.send(e);
    });
};

/**
 * Delete a location for specific user
 */
function _delete(req, res)
{
    User.findOneAndRemove(
        {
            _id: req.params.id  
        })
        .then((rmDoc) => 
        {
            res.send(rmDoc);
        })
};