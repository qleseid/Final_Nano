//Model of user info

const mong = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/** JWT Secret **/
const ranStrSec = "This is a great bag of magic n913SM for some great token work";

require('mongoose-type-email');

const UserSchema = new mong.Schema(
    {
        // _id: mong.Schema.Types.ObjectId,
        username:
        {
            type: String,
            required: true,
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
            type: mong.SchemaTypes.Email,
            required: true
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
    return _.omit(userObject, ['password', 'sessions']);
}

UserSchema.methods.generateAccessAuthToken = function() 
{
    const user = this;
    return new Promise((resolve, reject) =>
    {
        //Create the JSON Web Token and return
        jwt.sign({_id: user._id.toHexString()},
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

UserSchema.statics.findByIdAndToken = function(_id, token)
{
    const User = this;

    return User.findOne(
        {
            _id,
            'sessions.token': token
        });
}

UserSchema.statics.findByCredentials = function(email, password)
{
    let User = this;
    return User.findOne({username}).then((user) =>
    {
        if(!user) //No user found
        {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => //User found
        {
            bcrypt.compare(password, user.password, (err, res) => 
            {
                if(res)
                {
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

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) =>
{
    let secondsSinceEpoch = Date.now() / 1000;
    if(expiresAt > secondsSinceEpoch)
    {
        return false; //Hasn't expired
    }
    else
    {
        return true; //Has Expired
    }
}

/** MIDDLEWARE **/

//Before user is saved
UserSchema.pre('save', function(next)
{
    let user = this;
    let costFact = 10;
    
    if(user.isModified('password'))
    {
        //Generate salt and hash
        bcrypt.genSalt(costFact, (err, salt) =>
        {
            bcrypt.hash(user.password, salt, (err, hash) =>
            {
                user.password = hash;
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
    let daysUntilExpire = "10";
    let secondUntilExpire = ((daysUntilExpire * 24) * 60) * 60;// * 3600
    return ((Date.now() / 1000) + secondUntilExpire);
}

const User = mong.model('User', UserSchema);

module.exports = {User};