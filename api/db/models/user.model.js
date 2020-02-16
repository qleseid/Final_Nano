"use strict";
exports.__esModule = true;
//Model of user info
var mongoose_1 = require("mongoose");
var server_config_1 = require("../../server.config");
//const mong = require('mongoose');
var _ = require("lodash/omit");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
/*
interface IUserModel extends Model<IUserDoc>
{
    findByIdAndToken: (_id, refreshToken) => Promise<any>;
    findByCredentials: (username, password) => any;
    getJWTSecret: () => string;
    hasRefreshTokenExpired: (expiresAt) => boolean;
}
*/
exports.UserSchema = new mongoose_1.Schema({
    // _id: mong.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 1
    },
    email: {
        type: String,
        required: 'Email address is required',
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    sessions: [{
            token: {
                type: String,
                required: true
            },
            expiresAt: {
                type: Number,
                required: true
            }
        }]
});
/* Instance Methods */
exports.UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    //return the document except the password and session
    return _(userObject, ['password', 'sessions']);
};
exports.UserSchema.methods.getJWTSecret = function () {
    try {
        return server_config_1.ranStrSec;
    }
    catch (err) {
        console.log("JWT secret get error");
    }
};
exports.UserSchema.methods.generateAccessAuthToken = function () {
    var user = this;
    return new Promise(function (resolve, reject) {
        //Create the JSON Web Token and return
        jwt.sign({ _id: user._id.toHexString() }, server_config_1.ranStrSec, { expiresIn: "15m" }, function (err, token) {
            if (!err) {
                resolve(token);
            }
            else {
                //Error happened
                reject();
            }
        });
    });
};
exports.UserSchema.methods.generateRefreshAuthToken = function () {
    return new Promise(function (resolve, reject) {
        crypto.randomBytes(64, function (err, buf) {
            if (!err) {
                var token = buf.toString('hex');
                return resolve(token);
            }
        });
    });
};
exports.UserSchema.methods.createSession = function () {
    var user = this;
    return user.generateRefreshAuthToken().then(function (refreshToken) {
        return saveSessionToDatabase(user, refreshToken);
    })
        .then(function (refreshToken) {
        return refreshToken;
    })["catch"](function (e) {
        return Promise.reject("Faided to save session to database.\n" + e);
    });
};
/** MODEL METHODS statics **/
exports.UserSchema.statics.findByIdAndToken = function (id, token) {
    var User = this;
    return User.findOne({
        _id: id,
        'sessions.token': token
    });
};
exports.UserSchema.statics.findByCredentials = function (username, password) {
    console.log("In Credential Find!");
    var User = this;
    return User.findOne({ username: username }).then(function (user) {
        if (!user) //No user found
         {
            console.log("In Credential no user found!");
            return Promise.reject(new Error('User not found'));
        }
        return new Promise(function (resolve, reject) {
            bcrypt.compare(password, user.password, function (err, res) {
                if (res) {
                    console.log("In Credential user pass encrypt!");
                    resolve(user);
                }
                else {
                    reject();
                }
            });
        });
    });
};
exports.UserSchema.statics.hasRefreshTokenExpired = function (expiresAt) {
    var secondsSinceEpoch = Date.now() / 1000;
    if (expiresAt > secondsSinceEpoch) {
        console.log("Token hasn't expired!");
        return false; //Hasn't expired
    }
    else {
        console.log("Token expired!");
        return true; //Has Expired
    }
};
/** MIDDLEWARE **/
//Before user is saved
exports.UserSchema.pre('save', function (next) {
    var User = this;
    var costFact = 10;
    var me = User.password;
    console.log("In User Pre: " + me);
    if (User.isModified('password')) {
        //Generate salt and hash
        bcrypt.genSalt(costFact, function (err, salt) {
            bcrypt.hash(User.password, salt, function (err, hash) {
                console.log("In User Pre Hash:");
                User.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});
/** HELPERS **/
var saveSessionToDatabase = function (user, refreshToken) {
    //Save session to database
    return new Promise(function (resolve, reject) {
        var expiresAt = generateRefreshTokenExpireTime();
        user.sessions.push({ 'token': refreshToken, expiresAt: expiresAt });
        user.save()
            .then(function () {
            return resolve(refreshToken);
        })["catch"](function (e) {
            reject(e);
        });
    });
};
var generateRefreshTokenExpireTime = function () {
    var daysUntilExpire = 10;
    var secondUntilExpire = ((daysUntilExpire * 24) * 60) * 60; // * 3600
    return ((Date.now() / 1000) + secondUntilExpire);
};
exports["default"] = mongoose_1.model("User", exports.UserSchema);
