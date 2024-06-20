const UserModel = require("../Model/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const productModel = require('../Model/productModel')
const maxAge = 3 * 24 * 60 * 60;


const createToken = (userId) => {
  const token = jwt.sign({ userId }, "jwt", { expiresIn: maxAge });
  return token;
};

module.exports.Signup = async (req, res, next) => {
  console.log(req.body, "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
  const { email, password, name } = req.body
  try {
    const emailExist = await UserModel.findOne({ email: email })
    if (emailExist) {
      return res.json({ message: "Email already exist", status: false })
    }
    const newUser = new UserModel({
      name: name,
      email: email,
      password: password,

    });

    const userDetails = await (newUser.save());
    const token = createToken(UserModel._id);
    return res.json({
      message: "Account created Successfully",
      status: true,
      token,
    });
  }

  catch (err) {
    console.log(err);
    return res.json({
      message: "Internal sever in signup",
      status: false
    });

  }
};

module.exports.Login = async (req, res, next) => {
  console.log(req.body, "%%%%%%%%%%%");
  const { email, password } = req.body;


  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      const passwordMatches = await bcrypt.compare(password, user.password);

      if (passwordMatches) {
        const token = createToken(user._id);
        return res
          .status(200)
          .json({
            user: user,
            message: "User Login Succesfully",
            created: true,
            token,
          });
      }
      else {
        return res.json({ message: "Incorrect password", created: false });
      }
    }
    else {
      return res.json({ message: "Account not found", created: false })
    }
  }
  catch (error) {
    console.log(error);

    return res.json({ message: "Internal server in sign up", created: false })
  }
};



module.exports.shopProduct = async (req, res, next) => {
  try {
    const data = await productModel.find();
    res.json({
      message: "Product Data fetched",
      status: true,
      shopProduct: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error during product fetching",
      status: false,
    });
  }
};


module.exports.childProduct = async (req, res, next) => {
  try {
    const data = await productModel.find({
      category:"Child"

    }
   );
    res.json({
      message: "Child Product Data fetched",
      status: true,
      shopProduct: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error during product fetching",
      status: false,
    });
  }
};



module.exports.adultProduct = async (req, res, next) => {
  try {
    const data = await productModel.find({
      category:"Adult"

    }
   );
    res.json({
      message: "Adult Product Data fetched",
      status: true,
      shopProduct: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error during product fetching",
      status: false,
    });
  }
};



module.exports.productDetails = async (req, res) => {
  try {
    const productId = req.params.id;
    const singleProduct = await productModel.findById(productId);
    if (singleProduct) {
      return res.status(200).json({
        message: "success",
        status: true,
        product: singleProduct,
      });
    }
    res.status(404).json({
      message: "Product not found",
      status: false,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};



module.exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (userId) {
      res.status(200).json({ message: "User id fetched", userId: userId });
    } else {
      res.status(404).json({ message: "User id not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.userStatus = async (req, res) => {
  try {
    const user = req.user;
    console.log(user)
    if (user) {
      res.json({ user })
    } else {
      res.json({ user: null })
    }
  } catch (error) {
    console.log(error);
  }
};

//Add Cart

module.exports.addCart = async (req, res) => {
  try {
    const { userEmail, productId, quantity } = req.body;

    if (!userEmail || typeof userEmail !== 'string') {
      return res.status(400).json({ message: "Invalid or missing userEmail" });
    }
    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({ message: "Invalid or missing productId" });
    }
    if (quantity == null || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: "Invalid or missing quantity" });
    }

    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await productModel.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalPrice = product.price * quantity;

    const cartItem = user.cart.find(item => item.productId === productId);
    if (cartItem) {
      return res.status(409).json({ message: "Product already added" });
    } else {
      user.cart.push({
        productId,
        price: totalPrice,
        quantity
      });

      await user.save();
      return res.status(200).json({ message: "Successfully added to cart" });
    }
  } catch (error) {
    console.error("Error adding to cart:", error); 
    return res.status(500).json({ message: "Unable to add to cart", error: error.message });
  }
};



module.exports.removeCart = async (req, res) => {
  try {
    const { userEmail, productId } = req.body;

    if (!userEmail || typeof userEmail !== 'string') {
      return res.status(400).json({ message: "Invalid or missing userEmail" });
    }
    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({ message: "Invalid or missing productId" });
    }

    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItemIndex = user.cart.findIndex(item => item.productId === productId);
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    } else {
      user.cart.splice(cartItemIndex, 1);
      await user.save();
      return res.status(200).json({ message: "Successfully removed from cart" });
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({ message: "Unable to remove from cart", error: error.message });
  }
};



module.exports.getCart = async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail || typeof userEmail !== 'string') {
      return res.status(400).json({ message: "Invalid or missing userEmail" });
    }

    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = user.cart.map(item => ({
      productId: item.productId,
      price: item.price,
      quantity: item.quantity
    }));

    return res.status(200).json({ cart: cartItems });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return res.status(500).json({ message: "Unable to retrieve cart", error: error.message });
  }
};




//WishList


module.exports.AddToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.wishlist.includes(productId)) {
      // Remove product from wishlist
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
      await user.save();
      return res.status(201).json({
        message: "Product removed from wishlist",
      });
    } else {
      // Add product to wishlist
      user.wishlist.push(productId);
      await user.save();
      return res.status(200).json({
        message: "Product added to wishlist",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
