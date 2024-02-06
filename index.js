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
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "ancdefgh",
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

app.get("/login", async (req, res) => {
  res.render("userverification/login.ejs");
});
app.get("/register", (req, res) => {
  res.render("userverification/registration.ejs");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let data = await User.findOne({
    $and: [{ email: email }, { password: password }],
  });

  if (data) {
    req.session.isLogin = true;
    req.session.user = data;
    res.redirect("/");
  } else {
    return res.status(400).send("Data doesn't found");
  }
});

const isLoggedIn = function (req, res, next) {
  if (req.session.isLogin) {
    // if (true) {
    return next();
  } else {
    res.redirect("/login");
  }
};

app.post("/register", async (req, res) => {
  let { firstname: fname, lastname: lname, email, password } = req.body;

  let existingData = await User.findOne({ email: email });
  if (existingData) {
    setTimeout(() => {
      res.redirect;
    });
    return res
      .status(400)
      .send("Email is already in use. Please choose a different email.");
  } else {
    const registered = await User.create({
      firstname: fname,
      lastname: lname,
      email: email,
      password: password,
    });
    if (registered) {
      setTimeout(() => {
        res.redirect("/login");
      }, 2000);
    }
  }
});

app.get("/", isLoggedIn, async (req, res) => {
  const data = await Product.find();

  res.render("home.ejs", { data });
});

app.get("/shopping", isLoggedIn, async (req, res) => {
  const data = await Product.find();
  res.render("shopping.ejs", { data });
});

app.get("/shopping/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const [data] = await Product.find({ _id: id });
  res.render("checkout.ejs", { data });
});
app.get("/shopping/:id/order", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const data = await Product.findOne({ _id: id });
  res.render("orderDetails.ejs", { data });
});
app.post("/shopping/:id", isLoggedIn, async (req, res) => {
  let { pincode, state, phone, address } = req.body;
  let { id } = req.params;
  let userOrdered = req.session.user._id;
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
    userOrder: userOrdered,
    image: image,
  });

  res.redirect("/shopping");
});

app.get("/track", isLoggedIn, async (req, res) => {
  const data = await order.find({ userOrder: req.session.user._id });
  if (data) {
    res.render("track.ejs", { data });
  } else {
    res.send("<h1 style='text-align:center;'>No Order Yet</h1>");
  }
});
app.get("/cart", isLoggedIn, async (req, res) => {
  const data = await Cart.find({ user: req.session.user._id });
  res.render("cart.ejs", { data });
});

app.delete("/delete/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let data = await Cart.findOneAndDelete({
    $and: [{ productId: id }, { user: req.session.user._id }],
  });
  res.redirect("/cart");
});

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

app.get("/myProduct", isLoggedIn, async (req, res) => {
  const data = await Publish.find({ userId: req.session.user._id });
  res.render("myProduct.ejs", { data });
});

app.get("/myProduct/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let data = await Publish.findOne({ _id: id });
  // console.log(data);
  res.render("editMyProduct.ejs", { data });
});

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

app.delete("/myProduct/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const data1 = await Publish.findByIdAndDelete(id);
  const data2 = await Product.findOneAndDelete({ publishedBy: id });
  res.redirect("/shopping");
});

app.get("/publish", isLoggedIn, async (req, res) => {
  res.render("publish.ejs");
});

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
