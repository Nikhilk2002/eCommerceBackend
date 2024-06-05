const UserModel = require("../Model/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt =require("bcrypt")
const productModel=require('../Model/productModel')


const createToken = (userId) => {
    const token = jwt.sign({userId}, "JWT", { expiresIn: '2d'});
    return token;
  };

module.exports.Signup= async (req,res,next)=>{
    console.log(req.body,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")    
    const {email,password,name}= req.body
    try {
          const emailExist= await UserModel.findOne({email:email})
          if(emailExist){
            return res.json({message :"Email already exist", status:false})
          }
          const newUser= new UserModel({
            name:name,
            email:email,
            password:password,
    
        });

        const userDetails=await(newUser.save());
        const token =createToken(UserModel._id);
        return res.json({
            message:"Account created Successfully",
            status:true,
            token,
        });
    } 
    
    catch(err){
        console.log(err);
        return res.json({
            message:"Internal sever in signup",
            status:false
        });

    }
};

module.exports.Login = async(req,res,next)=>{
    console.log(req.body,"%%%%%%%%%%%");
    const{email,password}=req.body;


    try{
        const user = await UserModel.findOne({email});

        if(user){
            const passwordMatches =await bcrypt.compare(password,user.password);

            if(passwordMatches){
                const token = createToken(user._id);
                return res
                .status(200)
                .json({
                    user:user,
                    message:"User Login Succesfully",
                    created:true,
                    token,
                });
            }
            else{
                return res.json({message:"Incorrect password",created:false});
            }
        }
        else{
            return res.json({message:"Account not found",created:false})
        }
    }
    catch(error){
        console.log(error);

        return res.json({message:"Internal server in sign up",created:false})
    }
};



module.exports.shopProduct = async (req, res, next) => {
    try {
      const data = await productModel.find();
      res.json({
        message: "Product Data fetched",
        status: true,
        shopProduct: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error during product fetching",
        status: false,
      });
    }
  };