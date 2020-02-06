/**
 * LOAD MONGOOSE MODELS
 */
const { User } = require('./../db/models');
const express = require('express');
const router = express.Router(); 

// const { mong } = require('../db/mongoose');
/* LOCATION ROUTES */

router.get('/all', getAll);
router.get('/', get);
router.post('/', create);
router.post('/login', login);
router.patch('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

/**
 * Gets simple message to show it's working from browser
 */
function getAll(req, res) 
{
    console.log("In User Get!");
    res.json(
        {"message":
         "Welcome to User API."
        });
};


/**
 * Gets all users in db
 */
function get(req, res) 
{
    console.log("In User Get!");
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
 * Create a new user
 */
function create(req, res)
{
    console.log("In User Create!");

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => 
    {
        return newUser.createSession();
    })
    .then((refreshToken) => 
    {
        //Session created with success. Refresh token returned
        return newUser.generateAccessAuthToken().then((accessToken) => 
        {
            return {accessToken, refreshToken}
        });
    })
    .then((authToken) =>
    {
        res
        .header('x-refresh-token', authToken.refreshToken)
        .header('x-access-token', authToken.accessToken)
        .send(newUser);
    })
    .catch((e) =>
    {
        res.status(400).send(e);
    });
};

/**
 * Login user
 * 
 * @param {*} req 
 * @param {*} res 
 */
function login(req, res)
{
    console.log("In User Login!");

    let username = req.body.username;
    let password = req.body.password;

    User.findByCredentials(username, password).then((user) => 
    {
        return user.createSession().then((accessToken) =>
        {
            return {accessToken, refreshToken}
        });
    })
    .then((authToken) =>
    {
        res
        .header('x-refresh-token', authToken.refreshToken)
        .header('x-access-token', authToken.accessToken)
        .send(newUser);
    })
    .catch((e) =>
    {
        res.status(400).send(e);
    });
};

/**
 * Update a location for specific user
 */
function update(req, res)
{
    User.findOneAndUpdate({_id: req.params.id}, 
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
    User.findOneAndRemove(
        {
            _id: req.params.id  
        })
        .then((rmDoc) => 
        {
            res.send(rmDoc);
        })
};