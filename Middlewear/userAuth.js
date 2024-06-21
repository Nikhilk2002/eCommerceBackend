const jwt =require("jsonwebtoken");
const UserModel =require("../Model/UserModel")


module.exports =async (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        console.log(authHeader,"Middlewear one");
        const authToken = authHeader && authHeader.split(" ")[1];
        console.log(authToken,"Middlewear two");

        if(!authToken){
            return res.json({
                loginfail:true,
                status :false,
                message:"No auth token",
            });
        }
        const decode =jwt.verify(authToken,"jwt");
        const user =await UserModel.findOne({_id:decode.userId});

        if(!user){
            return res.json({
                message:"Unautharized access",
                status :false,
                loginfail:true,
            });
        }
        req.user =user;
        next();
    }
    catch(error){
       console.log(error);
       return res.json({
        message:"Unautharized access",
        status :false,
        loginfail:true,
       });
    }
};


// const jwt = require("jsonwebtoken");
// const userModel = require("../Model/UserModel");

// module.exports = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     const authToken = authHeader && authHeader.split(" ")[1];

//     if (!authToken) {
//       return res.json({
//         loginfail: true,
//         status: false,
//         message: "No auth token",
//       });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(authToken, "JWT");
//     } catch (error) {
//       if (error.name === "TokenExpiredError") {
//         return res.status(401).json({
//           success: false,
//           message: "Token has expired",
//         });
//       }
//       if (error.name === "JsonWebTokenError") {
//         return res.status(401).json({
//           success: false,
//           message: "Invalid token",
//         });
//       }
//       console.error("Error verifying token:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }

//     const user = await userModel.findOne({ _id: decoded.user._id });

//     if (!user) {
//       return res.json({
//         message: "Unauthorized access",
//         status: false,
//         loginfail: true,
//       });
//     }

//     // if (user.blockStatus) {
//     //   return res.status(403).json({ message: "Your account is blocked." });
//     // }


//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Middleware error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };



