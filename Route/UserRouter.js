const express = require("express");
const { Signup,Login,shopProduct, userStatus, childProduct, adultProduct} = require("../Controller/UserController");
const userAuth=require("../Middlewear/userAuth")
const router = express.Router();

//POST Method

router.post('/signup',Signup)
router.post('/login',Login)

//GET Methods

router.get('/shop',userAuth, shopProduct)
router.get('/child',userAuth, childProduct)
router.get('/adult',userAuth, adultProduct)

router.get('/auth/status',userAuth,userStatus)

module.exports=router;
