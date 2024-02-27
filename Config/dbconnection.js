require('dotenv').config();
const mongoose=require("mongoose");

module.exports ={
    dbConnect: async()=>{
        try{
           await mongoose.connect(process.env.MONGODB_URL).then(()=>{
            console.log("Database Connected Succesfully")
           }

           );
        }
        catch(err){
            console.log(err)
        }
    },
}