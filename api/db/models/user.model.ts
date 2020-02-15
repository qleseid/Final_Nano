//Model of user info
import { model, Schema, Document, Model } from 'mongoose';
import { ranStrSec } from '../../server.config'

//const mong = require('mongoose');
import * as _ from 'lodash/omit';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

export interface IUserModel extends Model<any> 
{
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    sessions: [];
    // getJWTSecret: () => string;
    createSession: () => string;
    generateAccessAuthToken: () => any;
    generateRefreshAuthToken: () => any;
    findByIdAndToken: (_id, refreshToken) => Promise<any>;
    findByCredentials: (username, password) => any;
    getJWTSecret: () => string;
    hasRefreshTokenExpired: (expiresAt) => boolean;
}

/*
interface IUserModel extends Model<IUserDoc>
{
    findByIdAndToken: (_id, refreshToken) => Promise<any>;
    findByCredentials: (username, password) => any;
    getJWTSecret: () => string;
    hasRefreshTokenExpired: (expiresAt) => boolean;
}
*/

export var UserSchema: Schema = new Schema<IUserModel>(
    {
        // _id: mong.Schema.Types.ObjectId,
        username:
        {
            type: String,
            required: true,
            unique: true,
            minlength: 1,
            trim: true
        },
        firstname:
        {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        lastname:
        {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        password:
        {
            type: String,
            required: true,
            minlength: 1
        },
        email:
        {
            type: String,
            required: 'Email address is required',
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        

        },
        sessions:
        [{
            token: 
            {
                type: String,
                required: true
            },
            expiresAt:
            {
                type: Number,
                required: true
            }
        }]
    }
);

/* Instance Methods */
UserSchema.methods.toJSON = function()
{
    const user = this;
    const userObject = user.toObject();

    //return the document except the password and session
    return _(userObject, ['password', 'sessions']);
}

UserSchema.methods.getJWTSecret = function(): string
{
    try
    {
        return ranStrSec;
    }
    catch(err)
    {
        console.log("JWT secret get error");
    }
}

UserSchema.methods.generateAccessAuthToken = function() 
{
    const user = this;
    return new Promise((resolve, reject) =>
    {
        //Create the JSON Web Token and return
        jwt.sign(
            {_id: user._id.toHexString()},
            ranStrSec,
            { expiresIn: "15m"},
            (err, token) =>
            {
                 if(!err)
                {
                     resolve(token);
                }
                else
                {
                    //Error happened
                    reject();
                }
            })
    })
}

UserSchema.methods.generateRefreshAuthToken = function()
{
    return new Promise((resolve, reject) => 
    {
        crypto.randomBytes(64, (err, buf) =>
        {
            if(!err)
             {
                 let token = buf.toString('hex');
                 return resolve(token);
             }
        })
    })
}

UserSchema.methods.createSession = function()
{
    let user = this;
    return user.generateRefreshAuthToken().then((refreshToken) =>
    {
        return saveSessionToDatabase(user, refreshToken);
    })
    .then((refreshToken) =>
    {
        return refreshToken;
    })
    .catch((e) =>
    {
        return Promise.reject("Faided to save session to database.\n" + e);
    })
}


/** MODEL METHODS statics **/

UserSchema.statics.findByIdAndToken = function(id, token): any
{
    const User = this;

    return User.findOne(
        {
            _id: id,
            'sessions.token': token
        });
}

UserSchema.statics.findByCredentials = function(username, password)
{
    console.log("In Credential Find!");

    let User = this;
    return User.findOne({username}).then((user) =>
    {
        if(!user) //No user found
        {
    	    console.log("In Credential no user found!");
            return Promise.reject(new Error('User not found'));
        }
        return new Promise((resolve, reject) => //User found
        {
            bcrypt.compare(password, user.password, (err, res) => 
            {
                if(res)
                {
    	            console.log("In Credential user pass encrypt!");
                    resolve(user);
                }
                else
                {
                    reject();
                }
            })
        })
    })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt): boolean =>
{
    let secondsSinceEpoch = Date.now() / 1000;
    if(expiresAt > secondsSinceEpoch)
    {
		console.log("Token hasn't expired!");
        return false; //Hasn't expired
    }
    else
    {
		console.log("Token expired!");
        return true; //Has Expired
    }
}

/** MIDDLEWARE **/

//Before user is saved
UserSchema.pre('save', function(next)
{
    let User: any = this;
    let costFact = 10;
    let me = User.password;
    console.log("In User Pre: " + me);

    if(User.isModified('password'))
    {
        //Generate salt and hash
        bcrypt.genSalt(costFact, (err, salt) =>
        {
            bcrypt.hash(User.password, salt, (err, hash) =>
            {
                console.log("In User Pre Hash:");
                User.password = hash;
                next();
            })
        })
    }
    else
    {
        next();
    }
});


/** HELPERS **/

let saveSessionToDatabase = (user, refreshToken) => 
{
    //Save session to database
    return new Promise((resolve, reject) =>
    {
        let expiresAt = generateRefreshTokenExpireTime();

        user.sessions.push({'token': refreshToken, expiresAt});

        user.save()
        .then(() => 
        {
            return resolve(refreshToken);
        })
        .catch((e) =>
        {
            reject(e);
        })
    })
}

let generateRefreshTokenExpireTime = () =>
{
    let daysUntilExpire = 10;
    let secondUntilExpire = ((daysUntilExpire * 24) * 60) * 60;// * 3600
    return ((Date.now() / 1000) + secondUntilExpire);
}

export default model<IUserModel & Document>("User", UserSchema);
