// Handles MongoDB connection logic
import * as mong from 'mongoose';
import { mongDb } from '../server.config'
//const mong = require('mongoose');

require('mongoose').Promise = global.Promise;

mong.connect(mongDb, 
{
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(() =>
{
    console.log("Connected to MongoDB at StorageBox");
})
.catch((e) => 
{
    console.log("Error connecting to MongoDB collection StorageBox");
    console.log(e);
});

//Stop deprecation warnings from MongoDB native drivers
mong.set('useCreateIndex', true);
mong.set('useFindAndModify', false);

export var mongs = mong.connection;

console.log("Past exports");