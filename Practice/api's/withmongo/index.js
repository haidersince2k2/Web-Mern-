const express=require('express');
const app=express();
const mongoose=require('mongoose');
const employeeroute=require('./routess/Employee');
app.use(express.json());
app.use(employeeroute);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', function(req,res){
    res.send("hello");
})
mongoose.connect("mongodb://127.0.0.1/labpract").then(()=>{
console.log("connected to mongo");
})
.catch(err=>{
    console.log(err);
})

app.listen(3000);

