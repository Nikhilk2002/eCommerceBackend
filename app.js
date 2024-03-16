require('dotenv').config();
const express=require("express");

const cors=require("cors")
const dbConnect=require("./Config/dbconnection");
const dbconnection = require('./Config/dbconnection');
const app=express();


dbconnection.dbConnect();

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
});

app.use(cors())
app.use("/",userRouter)
app.use("/admin",adminRouter)