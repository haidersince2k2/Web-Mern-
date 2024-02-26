const express=require("express");
const router=express.Router();
const Employee=require('../Models/Employee');



router.get('/employee',async function(req,res){
    const employee=await Employee.find();
    res.redirect("display");
})


module.exports=router;