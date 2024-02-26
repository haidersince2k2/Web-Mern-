const mongoose = require("mongoose");
let treadSchema = mongoose.Schema({
  title: String,
  price: Number,
  producttype:String,
  imageData: {
    type: Buffer,  // Use Buffer type for binary data (image)
  },
});
const Tread = mongoose.model("Tread", treadSchema);
module.exports = Tread;
  