const UserModel = require("../Model/UserModel");
const jwt = require('jsonwebtoken');

const createToken = (userId) => {
    const token = jwt.sign({userId}, "JWT", { expiresIn: '2d'});
    return token;
  };

module.exports.Signup= async (req,res,next)=>{
    console.log(req.body,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")    
    const {email,password,username}= req.body
    try {
          const emailExist= await UserModel.findOne({email:email})
          if(emailExist){
            return res.json({message :"Email already exist", status:false})
          }
          const newUser= new UserModel({
            username:username,
            email:email,
            password:password,
    
        });

        const userDetails=await(newUser.save());
        const token =createToken(UserModel._id);
        return res.json({
            message:"Account created Successfully",
            status:false,
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
