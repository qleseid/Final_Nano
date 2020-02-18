// const cors = require('cors');
import { router as location } from './controllers/location.controller';
import { router as login } from './controllers/login.controller';
import { router as users } from './controllers/user.controller';
import { router as item } from './controllers/item.controller';
import { mongDb } from './server.config'
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import express from "express";

const port = process.env.NODE_ENV === 'production' ? 80 : 3000;
const app = express();

/**
* LOAD MONGOOSE
*/

mongoose.connect(
    mongDb,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err: any) =>
    {
        if (err)
        {
            console.log("Error connecting to MongoDB collection StorageBox");
            console.log(err);
        }
        else
        {
            console.log("Connected to MongoDB at StorageBox");
        }
    })
    
    //Stop deprecation warnings from MongoDB native drivers
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);

/**
* LOAD MIDDLEWARE
*/
/** MIDDLEWARE**/
//app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
app.use(function (req: any, res: any, next: any) {
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
app.use(function (err: any, req: any, res: any, next: any) 
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