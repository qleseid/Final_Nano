"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_config_1 = require("../../server.config");
const mongoose = __importStar(require("mongoose"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const lodash_1 = __importDefault(require("lodash"));
exports.UserSchema = new mongoose.Schema({
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
    const user = this;
    const userObject = user.toObject();
    //return the document except the password and session
    return lodash_1.default.omit(userObject, ['password', 'sessions']);
};
exports.UserSchema.methods.generateAccessAuthToken = function () {
    const user = this;
    return new Promise((resolve, reject) => {
        //Create the JSON Web Token and return
        jwt.sign({ _id: user._id.toHexString() }, server_config_1.ranStrSec, { expiresIn: "15m" }, (err, token) => {
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
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                let token = buf.toString('hex');
                return resolve(token);
            }
        });
    });
};
exports.UserSchema.methods.createSession = function () {
    let user = this;
    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    })
        .then((refreshToken) => {
        return refreshToken;
    })
        .catch((e) => {
        return Promise.reject("Faided to save session to database.\n" + e);
    });
};
/** MODEL METHODS statics **/
exports.UserSchema.statics.getJWTSecret = function () {
    return server_config_1.ranStrSec;
};
exports.UserSchema.statics.findByIdAndToken = function (id, token) {
    const User = this;
    return User.findOne({
        _id: id,
        'sessions.token': token
    });
};
exports.UserSchema.statics.findByCredentials = function (username, password) {
    console.log("In Credential Find!");
    let User = this;
    return User.findOne({ username }).then((user) => {
        if (!user) //No user found
         {
            console.log("In Credential no user found!");
            return Promise.reject(new Error('User not found'));
        }
        return new Promise((resolve, reject) => //User found
         {
            bcrypt.compare(password, user.password, (err, res) => {
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
exports.UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000;
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
    let User = this;
    let costFact = 10;
    let me = User.password;
    console.log("In User Pre: " + me);
    if (User.isModified('password')) {
        //Generate salt and hash
        bcrypt.genSalt(costFact, (err, salt) => {
            bcrypt.hash(User.password, salt, (err, hash) => {
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
let saveSessionToDatabase = (user, refreshToken) => {
    //Save session to database
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpireTime();
        user.sessions.push({ 'token': refreshToken, expiresAt });
        user.save()
            .then(() => {
            return resolve(refreshToken);
        })
            .catch((e) => {
            reject(e);
        });
    });
};
let generateRefreshTokenExpireTime = () => {
    let daysUntilExpire = 10;
    let secondUntilExpire = ((daysUntilExpire * 24) * 60) * 60; // * 3600
    return ((Date.now() / 1000) + secondUntilExpire);
};
//This took 13 days to figure out. Thank you StackOverflow, no thank you Mongoose!
exports.default = mongoose.model("User", exports.UserSchema);
