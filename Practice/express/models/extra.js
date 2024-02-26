const mongoose = require("mongoose");
let extraSchema = mongoose.Schema({
  title: String,
  price: Number,
  producttype:String,
  
  imageData: {
    type: Buffer,  // Use Buffer type for binary data (image)
  },
});
const Extra = mongoose.model("Extra", extraSchema);
module.exports = Extra;
