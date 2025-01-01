const mongoose = require('mongoose')
require("dotenv").config();

const connection=mongoose.connect(process.env.MONGODB_URL,{
    serverSelectionTimeoutMS: 30000 
});

module.exports={connection}