/**
 * LOAD MONGOOSE MODELS
 */
const { User } = require('./../db/models');
const { Login } = require('../db/models');
const { Location } = require('../db/models');

const express = require('express');
const router = express.Router(); 

// const { mong } = require('../db/mongoose');

/* LOCATION ROUTES */

router.post('/make', create);
router.post('/login', login);

module.exports = router;

/**
 * Create new user
 */
function create(req, res)
{
    console.log("In Login-Create User!");

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
 *    LOGIN
 *  
 * @param {*} req 
 * @param {*} res 
 */
function login(req, res)
{
    console.log("In Login!");

    let username = req.body.username;
    let password = req.body.password;

    User.findByCredentials(username, password).then((user) => 
    {
        return user.createSession().then((refreshToken) =>
        {
            return user.generateAccessAuthToken().then((accessToken) =>
            {
                return {accessToken, refreshToken}
            });
        })
        .then((authToken) =>
        {
            res
            .header('x-refresh-token', authToken.refreshToken)
            .header('x-access-token', authToken.accessToken)
            .send(user);
        });
    })
    .catch((e) =>
    {
        res.status(400).send(e);
    });    
};
