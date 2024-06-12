const mongoose =require("mongoose");
const productScheema=new mongoose.Schema({
    prod_name:String,
    description:String,
    price:Number,
    image:String,
    category:String   
});

const Product= mongoose.model('products',productScheema);
module.exports=Product;