const express = require("express");
const { Login, userList,addProduct, productList} = require("../Controller/adminController");
const adminAuth =require("../Middlewear/adminAuth")
const router = express.Router();
//POST Methods
router.post("/login", Login);
router.post("/add", addProduct);

//GET Methods
router.get("/user",userList)
router.get("/product",productList)



module.exports = router;