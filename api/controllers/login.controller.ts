import { UserSchema, IUserModel } from './../db/models/user.model';
/**
 * LOAD MONGOOSE MODELS
 */
import { User } from '../db/models'
//const { User } = require('../db/models');
//const { Login } = require('../db/models');
//const { Location } = require('../db/models');
import Q = require('q');
import express = require('express');

export const router = express.Router(); 

// const { mong } = require('../db/mongoose');

/* LOCATION ROUTES */

router.post('/make', _create);
router.post('/login', login);


/**
 * Create new user
 */
function _create(req, res)
{
    console.log("In Login-Create User!");

    let username = req.body.username;
    let newUser = new User(req.body);

    checkUser(username)
    .then(() =>
    {
        User.create(newUser).then(() => 
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
            console.log("Inside Reg Cre" + e);
            res.status(400).send("" + e);
        });
    })
    .catch((e) =>
    {
        console.log("Inside _Create" + e);
        res.status(418).send("" + e);
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
        console.log("" + e);
        res.status(400).send("" + e);
    });    
};

/**
 * CHECK FOR USER
 * 
 * @param body 
 */
function checkUser (username)
{
    let def = new Q.defer();
    console.log("In Check User!");

    User.findOne({username}, (err, user) =>
    {
        console.log("In Check User FindOne!");
        if (err)
        {
    	    console.log("In Check User Error!");
            def.reject(new Error("Error checking user"));
        }

        if (user)
        {
            console.log("In Check User Found user error!");
            def.reject(new Error(`Username ${username} already exists`));
        }
        else
        {
    	    console.log("In Check User resolve!");
            def.resolve();
        }
    });
    return  def.promise;
}
