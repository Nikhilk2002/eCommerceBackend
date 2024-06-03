const express = require("express");
const { Signup,Login,shopProduct} = require("../Controller/UserController");
const route = express.Router();

//POST Method

route.post('/signup',Signup)
route.post('/login',Login)

//GET Methods

route.get('/shop',shopProduct)


module.exports=route;
