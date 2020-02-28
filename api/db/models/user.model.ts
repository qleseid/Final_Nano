import { ranStrSec } from '../../server.config'
import * as mongoose from "mongoose";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as crypto from 'crypto';
import _ from "lodash";

export interface IUserInterface extends mongoose.Document 
{
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    sessions: [];
    toJSON: () => any;
    createSession: () => any;
    generateAccessAuthToken: () => any;
    generateRefreshAuthToken: () => any;
}


interface IUserModelInterface extends mongoose.Model<IUserInterface>
{
    findByCredentials: (username: string, password: string) => any;
    findByIdAndToken: (_id: any, refreshToken: any) => any;
    hasRefreshTokenExpired: (expiresAt: any) => boolean;
    getJWTSecret: () => string;
}


export const UserSchema = new mongoose.Schema(
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
UserSchema.methods.toJSON = function(): any
{
    const user = this;
    const userObject = user.toObject();

    //return the document except the password and session
    return _.omit(userObject, ['password', 'sessions']);
}

UserSchema.methods.generateAccessAuthToken = function(): any
{
    const user = this;
    return new Promise((resolve, reject) =>
    {
        //Create the JSON Web Token and return
        jwt.sign(
            {_id: user._id.toHexString()},
            ranStrSec,
            { expiresIn: "15m"},
            (err: any, token: any) =>
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

UserSchema.methods.generateRefreshAuthToken = function(): any
{
    return new Promise((resolve, reject) => 
    {
        crypto.randomBytes(64, (err: any, buf: any) =>
        {
            if(!err)
             {
                 let token = buf.toString('hex');
                 return resolve(token);
             }
        })
    })
}

UserSchema.methods.createSession = function(): any
{
    let user = this;
    return user.generateRefreshAuthToken().then((refreshToken: any) =>
    {
        return saveSessionToDatabase(user, refreshToken);
    })
    .then((refreshToken: any) =>
    {
        return refreshToken;
    })
    .catch((e: any) =>
    {
        return Promise.reject("Faided to save session to database.\n" + e);
    })
}


/** MODEL METHODS statics **/


UserSchema.statics.getJWTSecret = function(): string
{
    return ranStrSec;
    
}

UserSchema.statics.findByIdAndToken = function(id: any, token: any): any
{
    const User = this;

    return User.findOne(
        {
            _id: id,
            'sessions.token': token
        });
}

UserSchema.statics.findByCredentials = function(username: string, password: string): any
{
    console.log("In Credential Find!");
    let User = this;

    return User.findOne({username}).then((user: any) =>
    {
        if(!user) //No user found
        {
    	    console.log("In Credential no user found!");
            return Promise.reject(new Error('User not found'));
        }
        return new Promise((resolve, reject) => //User found
        {
            bcrypt.compare(password, user.password, (err: any, res: any) => 
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

UserSchema.statics.hasRefreshTokenExpired = (expiresAt: any): boolean =>
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
UserSchema.pre('save', function(next: mongoose.HookNextFunction)
{
    let User: any = this;
    let costFact = 10;
    let me = User.password;
    console.log("In User Pre: " + me);

    if(User.isModified('password'))
    {
        //Generate salt and hash
        bcrypt.genSalt(costFact, (err: any, salt: any) =>
        {
            bcrypt.hash(User.password, salt, (err: any, hash: any) =>
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

let saveSessionToDatabase = (user: any, refreshToken: any) => 
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
        .catch((e: any) =>
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

//This took 13 days to figure out. Thank you StackOverflow, no thank you Mongoose!
export default mongoose.model<IUserInterface, IUserModelInterface>("User", UserSchema);
