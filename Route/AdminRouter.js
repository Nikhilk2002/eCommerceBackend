const express = require("express");
const { Login, userList } = require("../Controller/adminController");
const router = express.Router();



router.post("/login", Login);


router.get("/user",userList)



module.exports = router;