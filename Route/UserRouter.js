const express = require("express");
const { Signup } = require("../Controller/UserController");
const route = express.Router();

route.post('/signup',Signup)

module.exports=route;
