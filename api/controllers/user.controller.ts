import { Request, Response} from "express";
import { User } from '../db/models'
import express = require("express");
const mid = require('./middleware');

export const router = express.Router(); 

// const { mong } = require('../db/mongoose');

/* LOCATION ROUTES */

router.get('/me/access-token', mid.verify, auth);
router.get('/all', mid.authenticate, getAll);
router.get('/:id', mid.authenticate, getById);
router.delete('/:id', mid.authenticate, _delete);


/** AUTHENTICATE
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function auth(req: any, res: Response)
{
    console.log("In User Auth!");
		
    //User is authenticated, user_id and user object available
    req.userObject.generateAccessAuthToken().then((accessToken: string | string[] | undefined) =>
    {
        res.header('x-access-token', accessToken).send({accessToken});
    })
    .catch((e: any) =>
    {
        res.status(400).send(e);
    });
}

/**
 * Gets simple message to show it's working from browser
 */
function getAll(req: Request, res: Response) 
{
    console.log("In All User Get!");

    User.find((err: any, users: any) =>
    {
        if (err)
        {
            res.send(err);
        }
        else
        {
            res.send(users);
        }
    });
};


/**
 * Gets user by id
 */
function getById(req: Request, res: Response) 
{
    console.log("In User Get!")

    User.findById(req.params.id, (err: any, user: any) =>
    {
        if (err)
        {
            res.send(err);
        }
        else
        {
            res.send(user);
        }
    });
};

/**
 * Delete a location for specific user
 */
function _delete(req: Request, res: Response)
{
    User.deleteOne({_id: req.params.id}, (err: any) => 
        {
            if (err)
            {
                res.send(err);
            }
            else
            {
                res.send("Successfully Deleted User");
            }
        })
};