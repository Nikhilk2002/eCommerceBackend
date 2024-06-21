const express = require("express");
const { Signup,Login,shopProduct, userStatus, childProduct, adultProduct, productDetails, getUser, AddToWishlist, checkWislist, getWishlist, removeWishlist, addToCart, getCart, removeFromCart, editCart} = require("../Controller/UserController");
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

router.post('/cart/add',userAuth, addToCart)
router.get('/cart',userAuth, getCart)
router.delete('/cart/remove',userAuth, removeFromCart)
router.put('/cart/edit',userAuth, editCart);


//WishList
router.post("/wishlist",userAuth, AddToWishlist);
router.get("/wishlist/check/:productId",userAuth, checkWislist);
router.get('/wishlist',userAuth,getWishlist)
router.delete("/wishlist/remove/:productId", userAuth,removeWishlist);

module.exports=router;
