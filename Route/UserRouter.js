const express = require("express");
const { Signup,Login,shopProduct, userStatus, childProduct, adultProduct, productDetails, getUser, addCart} = require("../Controller/UserController");
const userAuth=require("../Middlewear/userAuth")
const router = express.Router();

//POST Method

router.post('/signup',Signup)
router.post('/login',Login)
router.post('/addcart',addCart)
//GET Methods

router.get('/shop',userAuth, shopProduct)
router.get('/child',userAuth, childProduct)
router.get('/adult',userAuth, adultProduct)

router.get('/shop/:id',productDetails)
router.get('/auth/status',userAuth,userStatus)
router.get('/user/:id',getUser)

module.exports=router;
