const adminModel = require("../Model/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Product =require("../Model/productModel")
const UserModel = require("../Model/UserModel");
const productModel=require("../Model/productModel")
const maxAge = 3 * 24 * 60 * 60;

const createToken = (adminId) => {
  const token = jwt.sign({ adminId }, "JWT", { expiresIn: maxAge });
  return token;
};

module.exports.Login = async (req, res, next) => {
  console.log(req.body, "@@@@@@@@@@@@@@@@@@@@@@@");
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email });

    if (admin) {
      const passwordMatches = await bcrypt.compare(password, admin.password);

      if (passwordMatches) {
        const token = createToken(admin._id);
        return res.status(200).json({
          admin: admin,
          message: "Admin login successful",
          created: true,
          token,
        });
      } else {
        return res.json({
          message: "Incorrect passoword",
          created: false,
        });
      }
    } else {
      return res.json({
        message: "Account not found",
        created: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server in sign up",
      created: false,
    });
  }
};


module.exports.userList = async (req, res, next) => {
  try{
    const data = await UserModel.find();

    res.json({
      message: "User list fetched",
      status: true,
      UserList: data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error in userlist",
      status: false,
    });
  }
};


module.exports.addProduct =async (req,res)=>{
  try {
      const { prod_name ,title, price, description,image,catogery}=req.body;
         
      const products=new Product({prod_name:prod_name ,price:price, description:description,image: image,title:title,catogery:catogery});
      await products.save();
      res.json({message:"product added successfully"});
  } catch (error) {
      res.status(400).json({error:error.message});
      
  }
};

module.exports.productList=async (req,res,next)=>{

  try{
    const data=await productModel.find();

    res.status(200).json({
      message: "Products fetched",
      status: true,
      productList: data,
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error during product fetching",
      status: false,
    });
  }
}













