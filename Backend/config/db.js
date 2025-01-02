const mongoose = require('mongoose')
require("dotenv").config();

const connection=mongoose.connect(process.env.MONGODB_URL,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    connectTimeoutMS: 20000 
});

module.exports={connection}