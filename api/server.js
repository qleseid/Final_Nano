const cors = require('cors');
const express = require('express');
const app = express(); 

const { mong } = require('./db/mongoose');

const bodyParser = require('body-parser');
const jwt = require('express-jwt');

/**
 * LOAD MIDDLEWARE
 */
//app.use(cors());
//app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/loca/:id', (req, res) => 
{
    console.log("In Get!");
    Location.find({_id: req.params.id}).then((loca) =>
    {
        res.send(loca);
    })
    .catch((e) =>
    {
        res.send(e);
    });
});


/************* ROUTE HANDLERS *******************/

app.use('/loca', require('./controllers/location.controller'));

// app.use('/login', require('./controllers/login.controller'));

// error handler
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid Token Bitch');
    } else {
        throw err;
    }
});

/**
 * LISTEN 
 * PORT: 3000
 * 
 * Port the server listens for requests on
 */
const port = process.env.NODE_ENV === 'production' ? 80 : 3000;
app.listen(port, () =>
{
    console.log(`Server running and listening on port ${port}`);
})