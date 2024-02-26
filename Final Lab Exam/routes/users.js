var express=require('express');
var router=express.Router();
var User=require('../models/user')
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// get users listing 
router.get('/signup',function(req,res,next){
    res.render("auth/signup");
});

router.get('/login',function(req,res,next){
    res.render("auth/login");
});
router.get('/logout', function (req, res, next) {
  // Display a confirmation dialog
  res.send(`
      <script>
          var confirmed = confirm("Are you sure you want to log out? Your cart will be emptied.");
          if (confirmed) {
              // If user confirms, proceed with logout
              window.location.href = "/perform-logout";
          } else {
              // If user cancels, redirect back to the home page or any other desired location
              window.location.href = "/";
          }
      </script>
  `);
});

// This route performs the actual logout and cart emptying
router.get('/perform-logout', function (req, res, next) {
  req.session.user = null;
  res.clearCookie("token");
  res.clearCookie("cart");
  req.session.flash = { type: "danger", message: "Logged out Successfully" };
  // Perform logic to empty the cart here

  // Redirect to the login page or any other desired location
  res.redirect("/login");
});

router.post('/signup',async function(req,res,next){
  let errors = User.validate(req.body);

  if (errors) {
    // If there are validation errors, flash the first error message
    req.session.flash = { type: "danger", message: errors[0] };
    return res.redirect("back");
  }

  try {
    // If validation passes, create a new user
    let user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password1 = await bcrypt.hash(user.password1, salt);
    await user.save();

    // Flash success message and redirect
    req.session.flash = { type: "success", message: "Registered Successfully" };
    return res.redirect("/login");
  } catch (error) {
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      req.session.flash = { type: "danger", message: "Email already in use" };
      return res.redirect("back");
    }

    // Handle other errors, e.g., database save error
    console.error("Error saving user:", error);
    req.session.flash = {
      type: "danger",
      message: "An error occurred during registration.",
    };
    return res.redirect("back");
  }
});
const cookie = require('cookie');

router.post('/login', async function(req, res, next) {
  let { email, password1 } = req.body;
  let user = await User.findOne({ email });
  

  if (!user) {
    req.session.flash = {
      type: "danger",
      message: "Email not registered. Please sign up.",
    };
    return res.redirect("/signup");
  }

  const isvalid = await bcrypt.compare(password1, user.password1);
  if (isvalid) {
    const token = jwt.sign({ userId: user._id }, 'secret-key', { expiresIn: '1h' });

    req.session.user = user.toObject();
    req.session.flash = { type: "success", message: "Logged in Successfully" };

    // Set the token in a cookie
    res.cookie("token",token,{maxAge:360000,httpOnly:true});

    return res.redirect("/home");
  } else {
    req.session.flash = { type: "danger", message: "Try Again" };
    res.redirect("/login");
  }
});


module.exports=router;