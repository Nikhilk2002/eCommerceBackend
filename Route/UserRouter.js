const express = require("express");
const { Signup,Login} = require("../Controller/UserController");
const route = express.Router();

route.post('/signup',Signup)
route.post('/login',Login)

module.exports=route;
