const express = require("express");
const { Signup,Login,shopProduct, userStatus, childProduct, adultProduct, productDetails, getUser, addCart, removeCart} = require("../Controller/UserController");
const userAuth=require("../Middlewear/userAuth")
const router = express.Router();

//POST Method

router.post('/signup',Signup)
router.post('/login',Login)
//GET Methods

router.get('/shop',shopProduct)
router.get('/child', childProduct)
router.get('/adult', adultProduct)

router.get('/shop/:id',productDetails)
router.get('/auth/status',userAuth,userStatus)
router.get('/user/:id',getUser)


//Cart code

router.post('/addcart',addCart)
router.delete('/removecart',removeCart)


module.exports=router;
