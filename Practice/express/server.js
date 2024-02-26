let express = require("express");
var expressLayouts = require("express-ejs-layouts");
var treadmilrouter = require("./routes/api/treadmil");
var matrouter = require("./routes/api/mat");
var weightrouter = require("./routes/api/weight");
var orderrouter = require("./routes/api/order");
var extrarouter = require("./routes/api/extra");
var UsersRouter = require("./routes/users");
var OrdersRouter = require("./routes/api/order");
const bodyParser = require("body-parser");

const Order = require("./models/orders");

var session = require("express-session");
const methodOverride = require("method-override");
var sessionauth = require("./middlewares/sessionauth");
var checkadminauth = require("./middlewares/admin");
var cookieParser = require("cookie-parser");
const commonMiddleware = require("./middlewares/common");
let app = express();
app.use(session({ secret: "Shh, its a secret!" }));
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.json());
const mongoose = require("mongoose");
const checksessionauth = require("./middlewares/checksessionauth");
const tokenbaseauth = require("./middlewares/tokenbaseauth");
app.use(commonMiddleware);
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(sessionauth);
app.use(methodOverride("_method"));
app.use("/", treadmilrouter);
app.use("/", matrouter);
app.use("/", weightrouter);
app.use("/", UsersRouter);
app.use("/", orderrouter);
app.use("/", extrarouter);
app.use("/", OrdersRouter);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/home", function (req, res) {
  res.render("home");
});

app.get("/cart/remove/:id", async function (req, res) {
  try {
    let cart = [];
    if (req.cookies.cart) {
      cart = JSON.parse(req.cookies.cart);
      if (!Array.isArray(cart)) {
        cart = [];
      }
    }

    const indexToRemove = cart.findIndex((c) => c._id === req.params.id);
    if (indexToRemove !== -1) {
      cart.splice(indexToRemove, 1);
    }

    res.cookie("cart", JSON.stringify(cart));
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/cart", tokenbaseauth, function (req, res, next) {
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  if (!cart) cart = [];
  res.render("cart", { cart });
});

app.get("/orders", checkadminauth, async function (req, res) {
  let orders = await Order.find();
  res.render("ordersadmin", { orders });
});

app.get("/trainer", function (req, res) {
  res.render("trainers");
});

app.get(
  "/products/treadmill/updatetreadmill/:id",
  checkadminauth,
  async function (req, res) {
    let Tread = require("./models/treadmills");
    let product = await Tread.findById(req.params.id);
    res.render("updateproduct", { product });
  }
);

app.get(
  "/products/weight/updateweight/:id",
  checkadminauth,
  async function (req, res) {
    let Weight = require("./models/weight");
    let product = await Weight.findById(req.params.id);
    res.render("updateproduct", { product });
  }
);

app.get("/products/mat/updatemat/:id", checkadminauth, async function (req, res) {
  let Mat = require("./models/mat");
  let product = await Mat.findById(req.params.id);
  res.render("updateproduct", { product });
});

app.get(
  "/products/extra/updateextra/:id",
  checkadminauth,
  async function (req, res) {
    let Extra = require("./models/extra");
    let product = await Extra.findById(req.params.id);
    res.render("updateproduct", { product });
  }
);

app.get("/addproduct", checkadminauth, function (req, res) {
  res.render("addproduct");
});

app.get("/pricing", function (req, res) {
  res.render("pricing");
});

app.get("/profile", function (req, res) {
  res.render("profile");
});

app.get("/contact-us", function (req, res) {
  res.render("contact-us");
});

app.get("/empty-cart", (req, res) => {
  res.clearCookie("cart");
  res.redirect("/products/treadmills");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/mernstack")
  .then(async () => {
    console.log("Connected to Mongo");
  })
  .catch((error) => console.log(error.message));

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
