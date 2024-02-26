const mongoose = require("mongoose");
const Joi = require("joi");

let userSchema = mongoose.Schema({
  username: String,
  email: {
    type:String,
    unique:true,
  },
  branch: String,
  package: String,
  password1: String,
  role:String,
  
});
userSchema.statics.validate = function (data) {
  const userSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().min(8).required(),
    branch: Joi.string().required(),
    package: Joi.string().required(),
    password1: Joi.string().min(8).required(),
    
    role:Joi.string(),
  });

  const result = userSchema.validate(data, { abortEarly: false });

  if (result.error) {
    return result.error.details.map((error) => error.message);
  }

  return null;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
