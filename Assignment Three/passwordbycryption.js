var express=require('express');
var router=express.Router();
var User=require('../models/user')
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');



// route to hash password
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