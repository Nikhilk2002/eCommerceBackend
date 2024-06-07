const express = require("express");
const { Login, userList,addProduct, productList,removeUser,deleteProduct,editProduct, getProductById} = require("../Controller/adminController");
const adminAuth =require("../Middlewear/adminAuth")
const router = express.Router();

//POST Methods
router.post("/login", Login);
router.post("/add",adminAuth, addProduct);

//Delete Mwthods

router.delete('/user/:userId',adminAuth, removeUser);
router.delete('/product/:productId',adminAuth, deleteProduct)


//GET Methods
router.get("/user",adminAuth,adminAuth, userList)
router.get("/product",adminAuth, productList)


router.get('/product/:id',getProductById)

//Put method

router.put('/product/:id', editProduct);



module.exports = router;