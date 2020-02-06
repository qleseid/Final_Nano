// Handles MongoDB connection logic

const mong = require('mongoose');

mong.Promise = global.Promise;
mong.connect("mongodb://localhost:27017/storage-box", 
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

module.exports = 
{
    mong
};
// console.log("Past exports");