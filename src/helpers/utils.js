const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

let mongodb;

const openServer = async () => 
{
    mongodb = new MongoMemoryServer();

    await mongodb.start();
    
    const uri = mongodb.getUri();
    
    const mongooseOptions = {
        useNewUrlParser:true,
        useUnifiedTopology: true
    };
    
    await mongoose.connect(uri,mongooseOptions);
};

const closeServer = async () => 
{
    await mongoose.disconnect();
    await mongodb.stop();
};

module.exports = { openServer, closeServer, mongodb };