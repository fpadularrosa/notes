require('dotenv').config();
const { API_PORT, MONGO_DB } = process.env;
const server = require('./src/server.js');
const mongoose = require('mongoose');

mongoose.connect(MONGO_DB)
.then(()=>{
    console.log('database connected.');
    server.listen(API_PORT, (error) => {
        if(error) throw new Error(error);
        console.log('api listening at port: ', API_PORT);
    })
}).catch((error) => {
    console.error(error);
});