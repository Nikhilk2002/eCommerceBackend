const mongoose =require("mongoose");
const productScheema=new mongoose.Schema({
    prod_name:String,
    title:String,
    description:String,
    price:Number,
    image:String,
    catogery:String
    

});

const Product= mongoose.model('products',productScheema);
module.exports=Product;