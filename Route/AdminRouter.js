const express = require("express");
const { Login, userList,addProduct} = require("../Controller/adminController");
const adminAuth =require("../Middlewear/adminAuth")
const router = express.Router();


router.post("/login", Login);
router.post("/add", addProduct);


router.get("/user",userList)



module.exports = router;