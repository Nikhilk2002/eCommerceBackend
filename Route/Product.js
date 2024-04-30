const express = require("express");
const router = express.Router();
const Product = require("../Model/productModel");

router.get("/api/latestarrival", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;