const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const Product = require("./models/product.js");
const mongoose = require("mongoose");
const order = require("./models/order.js");
const User = require("./models/user.js");
const session = require("express-session");
const Cart = require("./models/cart.js");
const methodOverride = require("method-override");
const Publish = require("./models/mypublish.js");
// MiddleWares
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.json());
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "ancdefgh",
    cookie: {
      maxAge: 360000,
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
let PORT = process.env.PORT || 3030;

async function main() {
  await mongoose.connect(
    "mongodb+srv://Prakash:Prakash123@cluster0.5s7igb1.mongodb.net/FassSion"
  );
}

main()
  .then(() => {
    console.log("Database is Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Login Middleware check function
const isLoggedIn = function (req, res, next) {
  if (req.session.isLogin) {
    // if (true) {
    return next();
  } else {
    res.redirect("/login");
  }
};

//Login route for authentication
app.get("/login", async (req, res) => {
  res.render("userverification/login.ejs");
});
//Login route
app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let data = await User.findOne({
    $and: [{ email: email }, { password: password }],
  });

  if (data) {
    req.session.isLogin = true;
    req.session.user = data;
    res.status(200).send({ message: "Login successful" });
  } else {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

//Register Route
app.get("/register", (req, res) => {
  res.render("userverification/registration.ejs");
});
app.post("/register", async (req, res) => {
  let { firstname: fname, lastname: lname, email, password } = req.body;
  let existingData = await User.findOne({ email: email });
  if (existingData) {
    res.status(401).send({ message: "Email is already in use Try to log in" });
  } else {
    const registered = await User.create({
      firstname: fname,
      lastname: lname,
      email: email,
      password: password,
    });
    if (registered) {
      res.status(200).send({ message: "Registered successfully" });
    }
  }
});

//Home Route
app.get("/", isLoggedIn, async (req, res) => {
  const data = await Product.find();
  res.render("home.ejs", { data });
});

//Shopping route
app.get("/shopping", isLoggedIn, async (req, res) => {
  const data = await Product.find();
  res.render("shopping.ejs", { data });
});

//show shopping items
app.get("/shopping/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const [data] = await Product.find({ _id: id });
  res.render("checkout.ejs", { data });
});

//Proceed for order route
app.get("/shopping/:id/order", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const data = await Product.findOne({ _id: id });
  res.render("orderDetails.ejs", { data });
});

//Order items
app.post("/shopping/:id", isLoggedIn, async (req, res) => {
  let { pincode, state, phone, address } = req.body;
  let { id } = req.params;
  let {
    product: item,
    iPrice,
    fPrice,
    category,
    img: image,
  } = await Product.findOne({ _id: id });
  let finalPrice = +(fPrice + 5 + fPrice * 0.18).toFixed(2);
  let data = await order.create({
    item: item,
    iPrice: iPrice,
    fPrice: finalPrice,
    phone: phone,
    state: state,
    pincode: pincode,
    address: address,
    category: category,
    image: image,
  });
  let { _id: userId } = req.session.user;
  let user = await User.findOne({ _id: userId });
  user.myOrder.push(data);
  await user.save();
  res.redirect("/shopping");
});

//Track ordered items
app.get("/track", isLoggedIn, async (req, res) => {
  const { myOrder: data } = await User.findOne({
    _id: req.session.user._id,
  }).populate("myOrder");
  if (data) {
    res.render("track.ejs", { data });
  } else {
    res.status(200).json({ message: "No orders yet" });
  }
});

//Cart Items
app.get("/cart", isLoggedIn, async (req, res) => {
  const data = await Cart.find({ user: req.session.user._id });
  res.render("cart.ejs", { data });
});

//Remove items from cart
app.delete("/cart/:id/delete", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let data = await Cart.findOneAndDelete({
    $and: [{ productId: id }, { user: req.session.user._id }],
  });
  res.redirect("/cart");
});

//Add cart items
app.post("/cart/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let addedData = await Cart.findOne({
    $and: [{ productId: id }, { user: req.session.user._id }],
  });

  if (addedData) {
    res.send("Already added in cart");
  } else {
    let {
      product: item,
      iPrice,
      fPrice,
      category,
      img,
    } = await Product.findOne({ _id: id });

    let cartAdded = await Cart.create({
      product: item,
      iPrice: iPrice,
      fPrice: fPrice,
      category: category,
      img: img,
      productId: id,
      user: req.session.user._id,
    });
    res.redirect("/cart");
  }
});

//My Publish products
app.get("/myProduct", isLoggedIn, async (req, res) => {
  const data = await Publish.find({ userId: req.session.user._id });
  res.render("myProduct.ejs", { data });
});

//Edit page for published product
app.get("/myProduct/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let data = await Publish.findOne({ _id: id });
  // console.log(data);
  res.render("editMyProduct.ejs", { data });
});

//Edit published product
app.patch("/myProduct/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const {
    img: image,
    productName: product,
    category,
    iPrice,
    fPrice,
  } = req.body;
  const data1 = await Publish.findOneAndUpdate(
    { _id: id },
    {
      product: product,
      iPrice: iPrice,
      fPrice: fPrice,
      category: category,
      img: image,
    },
    {
      new: true,
    }
  );

  const data2 = await Product.findOneAndUpdate(
    { publishedBy: id },
    {
      product: product,
      iPrice: iPrice,
      fPrice: fPrice,
      category: category,
      img: image,
    },
    {
      new: true,
    }
  );
  res.redirect("/shopping");
});

//Delete myPublished product
app.delete("/myProduct/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const data1 = await Publish.findByIdAndDelete(id);
  const data2 = await Product.findOneAndDelete({ publishedBy: id });
  res.redirect("/shopping");
});
//Get published product Form
app.get("/publish", isLoggedIn, async (req, res) => {
  res.render("publish.ejs");
});

// Publish product submit
app.post("/publish", isLoggedIn, async (req, res) => {
  const { productname: product, iPrice, fPrice, category, img } = req.body;
  const data1 = await Publish.create({
    product,
    iPrice,
    fPrice,
    category,
    img,
    userId: req.session.user._id,
  });
  console.log(data1);
  const data2 = await Product.create({
    product,
    iPrice,
    fPrice,
    category,
    img,
    publishedBy: data1._id,
    createdBy: req.session.user._id,
    createdUser: req.session.user.firstname,
  });
  res.redirect("/shopping");
});

//Log out
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/login");
  });
});

app.listen(PORT, () => console.log(`App is Listening on port ${PORT}`));
