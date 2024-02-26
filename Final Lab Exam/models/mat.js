const mongoose = require("mongoose");
let matSchema = mongoose.Schema({
  title: String,
  price: Number,
  producttype:String,
  imageData: {
    type: Buffer,  // Use Buffer type for binary data (image)
  },
});
const Mat = mongoose.model("Mat", matSchema);
module.exports = Mat;
