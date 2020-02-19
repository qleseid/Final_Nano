import { IUserInterface } from './../db/models/user.model';
import { User } from '../db/models'
import jwt from 'jsonwebtoken';

exports.verify = function (req: any, res: any, next: any)
{
    console.log("In Middle verify!");
    //Get refresh token out of header
    let refreshToken = req.header('x-refresh-token');

    //Get _id from header
    let _id = req.header('_id');
	let users = new User();
    
    User.findByIdAndToken(_id, refreshToken).then((user: IUserInterface) =>
    {		
		
        if(!user)
        {
            return Promise.reject(
                {
                    "error": "User not found! Ensure token and id are correct"
                });
        }

        //User was found if this is reached
        //Valid session
        //Temp test, remove if nothing changes.
        req.params.user_id = user._id;
        
        req.user_id = user._id;
		users = user;
        req.userObject = users;
        req.refreshToken = refreshToken;

		console.log("Request params: " + req.params.user_id);
		console.log("Req any params: " + req.user_id);
		
        let isSessionValid = false;

        user.sessions.forEach((session: any) =>
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
            return Promise.reject(
            {
                "error": "Refresh token has expired or invalid session"
            });
        }
    })
    .catch((e: any) =>
    {
        res.status(401).send(e);
    })
};

// check whether the request has a valid JWT access token
exports.authenticate = function (req: any, res: any, next: any)
{
    let token = req.header('x-access-token');
    console.log("In Middle authenticate! " + token);

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err: any, decoded: any) => 
    {
        if (err) 
        {
            console.log("In Middle authenticate Error!");
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } 
        else 
        {
            console.log("In Middle authenticate Next!");
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });
};