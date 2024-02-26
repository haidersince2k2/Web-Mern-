const mongoose = require("mongoose");
let weightSchema = mongoose.Schema({
  title: String,
  price: Number,
  producttype:String,
  
  imageData: {
    type: Buffer,  // Use Buffer type for binary data (image)
  },
});
const Weight = mongoose.model("Weight", weightSchema);
module.exports = Weight;
