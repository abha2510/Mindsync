const express = require('express');
const cors= require('cors');
require("dotenv").config();
const {connection}= require("./config/db");
const { userRouter } = require('./Routes/UserRoute');
const { adminRouter } = require('./Routes/AdminRoute');

const app = express();
app.use(express.json());
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001','https://mindsync-opal.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With'
  };
app.use(cors(corsOptions))

app.get("/",(req,res)=>{
    res.send("Hello from Express Server");
})

app.use("/users",userRouter);
app.use("/admin",adminRouter)
app.listen(process.env.PORT,async()=>{
    try {
        
        await connection
        console.log(`sever running at port ${process.env.PORT}`)
    } catch (error) {
        console.log("error", error);
    }
})