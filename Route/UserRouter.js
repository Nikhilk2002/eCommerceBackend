const express = require("express");
const { Signup,Login,shopProduct, userStatus} = require("../Controller/UserController");
const userAuth=require("../Middlewear/userAuth")
const route = express.Router();

//POST Method

route.post('/signup',Signup)
route.post('/login',Login)

//GET Methods

route.get('/shop', shopProduct)


route.get('/auth/status',userAuth,userStatus)

module.exports=route;
