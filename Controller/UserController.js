const UserModel = require("../Model/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const productModel = require('../Model/productModel')
const maxAge = 3 * 24 * 60 * 60;


const createToken = (userId) => {
  const token = jwt.sign({ userId }, "JWT", { expiresIn: maxAge });
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
    const token = createToken(userDetails._id);
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

module.exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartItemIndex = user.cart.findIndex(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity: quantity });
    }

    await user.save();

    res.status(200).json({
      message: "Product added to cart",
      cart: user.cart,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
      status: false,
    });
  }
};

module.exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId).populate("cart.product");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};


module.exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItemIndex = user.cart.findIndex(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      user.cart.splice(cartItemIndex, 1);
      await user.save();
      return res.status(200).json({
        message: "Product removed from cart",
        cart: user.cart,
        status: true,
      });
    } else {
      return res.status(404).json({
        message: "Product not found in cart",
        status: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
      status: false,
    });
  }
};


module.exports.editCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItemIndex = user.cart.findIndex(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;
      await user.save();
      return res.status(200).json({
        message: "Cart updated successfully",
        cart: user.cart,
        status: true,
      });
    } else {
      return res.status(404).json({
        message: "Product not found in cart",
        status: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
      status: false,
    });
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
      
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
      await user.save();
      return res.status(201).json({
        message: "Product removed from wishlist",
      });
    } else {
      
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



module.exports.checkWislist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isInWishlist = user.wishlist.includes(productId);
    res.status(200).json({
      inWishlist: isInWishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports.getWishlist = async (req, res) => {
  try {
    const data = await UserModel.findById(req.user._id).populate("wishlist");

    res.status(200).json(data.wishlist);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.removeWishlist = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );
    await user.save();

    res.status(200).json({
      message: "product removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

