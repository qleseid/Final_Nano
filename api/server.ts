// const cors = require('cors');
import { router as location } from './controllers/location.controller';
import { router as login } from './controllers/login.controller';
import { router as users } from './controllers/user.controller';

import { router as item } from './controllers/item.controller';
import bodyParser = require('body-parser');
import { mongs } from './db/mongoose';

import express = require('express');
// import jwt from 'express-jwt';

const port = process.env.NODE_ENV === 'production' ? 80 : 3000;
const app = express(); 
mongs.once('open', () =>
{
    console.log("Connected");
});

/** MIDDLEWARE**/

/**
 * LOAD MIDDLEWARE
 */
//app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});


/** END OF MIDDLEWARE **/

/************* ROUTE HANDLERS *******************/

app.use('/loca', location);
app.use('/', login);

app.use('/users', users);
app.use('/item', item);

// error handler
app.use(function (err, req, res, next) 
{
    if (err.name === 'UnauthorizedError') 
    {
        res.status(401).send('Invalid Token Bitch');
    } 
    else 
    {
        throw err;
    }
});

/**
 * LISTEN 
 * PORT: 3000
 * 
 * Port the server listens for requests on
 */
app.listen(port, () =>
{
    console.log(`Server running and listening on port ${port}`);
})