//Model of login info

const mong = require('mongoose');
require('mongoose-type-email');

const LoginSchema = new mong.Schema(
    {
        _id: mong.Schema.Types.ObjectId,
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
        email:
        {
            type: mong.SchemaTypes.Email,
            required: true
        },
        ip:
        {
            type: String,
            required: true
        },
        created: 
        {
            type: Date,
            default: Date.now
        }
    }
);

const Login = mong.model('Login', LoginSchema);

module.exports = {Login};