const express = require("express");
const { Login, userList,addProduct, productList,removeUser,deleteProduct,editProduct} = require("../Controller/adminController");
const adminAuth =require("../Middlewear/adminAuth")
const router = express.Router();

//POST Methods
router.post("/login", Login);
router.post("/add", addProduct);

//Delete Mwthods

router.delete('/user/:userId',removeUser);
router.delete('/product/:productId',deleteProduct)


//GET Methods
router.get("/user",userList)
router.get("/product",productList)


//Put method

router.put('/edit/:productId',editProduct);



module.exports = router;