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
router.get("/user",adminAuth, userList)
router.get("/product",adminAuth, productList)


router.get('/edit/:id',adminAuth,getProductById)

//Put method

router.put('/edit/:productId',adminAuth, editProduct);



module.exports = router;