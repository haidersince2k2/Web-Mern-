const mongoose=require('mongoose');

const EmployeeSchema=mongoose.Schema({
    email:String,
    firstname:String,
    lastname:String,
    department:String
});

const Employee=mongoose.model("Employee",EmployeeSchema );

module.exports=Employee;
