/**
 * LOAD MONGOOSE MODELS
 */
const { User } = require('./../db/models');
const express = require('express');
const router = express.Router(); 

// const { mong } = require('../db/mongoose');
/* LOCATION ROUTES */


router.get('/token', auth);
router.get('/all', getAll);
router.get('/:id', getById);
router.post('/', create);
router.post('/login', login);
router.patch('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function auth(req, res, next)
{
    console.log("In User Auth!");
    //Get refresh token out of header
    let refreshToken = req.header('x-refresh-token');

    //Get _id from header
    let _id = req.header('_id');
	let users = new User();

	//console.log("Found ID: " + _id);
	//console.log("Found ID: " + req.query._id);
	//console.log("Found token: " + req.query.xrefreshtoken);
	//console.log("Found token: " + refreshToken);
		
    User.findByIdAndToken(_id, refreshToken).then((user) =>
    {		
		//console.log("Found user Token: " + user.sessions[0].token);
		//console.log("Found RefreshToken: " + refreshToken);
		
        if(!user)
        {
            return Promise.reject(
                {
                    "error": "User not found! Ensure token and id are correct"
                });
        }

        //User was found if this is reached
        //Valid session

		
        req.user_id = user._id;
		users = user;
        req.userObject = users;
        req.refreshToken = refreshToken;

		//console.log("user: " + user);
		//console.log("userObject: " + req.userObject);
		
        let isSessionValid = false;

        user.sessions.forEach((session) =>
        {
            if(session.token === refreshToken)
            {
                if(User.hasRefreshTokenExpired(session.expiresAt) === false)
                {
                    isSessionValid = true;
                }
            }
        });

        //Session expire check
        if(isSessionValid)
        {
            next(); //Valid session, continue on with request
        }
        else
        {
            return Promise.reject({
                "error": "Refresh token has expired or invalid session"
            });
        }
    })
    .catch((e) =>
    {
        console.log(e);
    });


	//console.log("Outside user: " + users);
		
    //User is authenticated, user_id and user object available
    users.generateAccessAuthToken().then((accessToken) =>
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
    console.log("In User Get!");
    res.json(
        {"message":
         "Welcome to User API."
        });
};


/**
 * Gets all users in db
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

/**
 * Update a location for specific userloca
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