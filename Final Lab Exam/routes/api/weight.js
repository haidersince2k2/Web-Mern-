const express = require("express");
let router = express.Router();
let Weight = require("../../models/weight");

const multer = require("multer");
const checksessionauth = require("../../middlewares/checksessionauth");
const checkadminauth = require("../../middlewares/admin");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });




router.post("/update/weight/:id", checkadminauth, upload.single("image"), async function (req, res) {
  try {
    const { title, price } = req.body;
    const productId = req.params.id;

    // Find the existing Weight record by ID
    const existingWeight = await Weight.findById(productId);

    if (!existingWeight) {
      return res.status(404).send('Weight not found');
    }

    // Update the existing Weight record
    existingWeight.title = title;
    existingWeight.price = price;

    // Check if a new image is provided
    if (req.file) {
      existingWeight.imageData = req.file.buffer;
    }

    await existingWeight.save();
    req.session.flash = {
      type: "success",
      message: "Product Updated Successfully.",
    };
    
    res.redirect("/products/weights");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post("/weight",checkadminauth, upload.single("image"), async function (req, res) {
  try {
    const { title, price, producttype ,color} = req.body;
    const imageData = req.file.buffer;
    
    let weight = new Weight({
      title: title,
      price: price,
      producttype:producttype,
      color:color,
      imageData: imageData,
    });

    await weight.save();
    req.session.flash = {
      type: "success",
      message: "Product Added Successfully.",
    };
    res.redirect("back");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.get("/weightdelete/:id", async function (req, res) {
  // return res.send(req.params);
  let weight = await Weight.findByIdAndDelete(req.params.id);
  req.session.flash = {
    type: "danger",
    message: "Product Deleted Successfully.",
  };
  res.redirect("back");
});
router.get('/weightcart/:id',checksessionauth, async function (req, res) {
  try {
    let weights = await Weight.findById(req.params.id);
    let cart = [];

    if (req.cookies.cart) {
      cart = JSON.parse(req.cookies.cart);
      if (!Array.isArray(cart)) {
        cart = [];
      }
    }

    // Only store title and price in the cart
    const { _id,title, price } = weights;
    cart.push({ _id,title, price, type:"weight" });
    req.session.flash = {
      type: "success",
      message: "Product Added to Cart Successfully.",
    };

    res.cookie('cart', JSON.stringify(cart));
    res.redirect('back');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/weightcart/remove/:id', async function (req, res) {
  try {
      
      let cart = [];
      if (req.cookies.cart) {
          // Parse the 'cart' cookie as JSON
          cart = JSON.parse(req.cookies.cart);
          // Ensure that cart is an array
          if (!Array.isArray(cart)) {
              cart = [];
          }
      }
      
      cart.splice(cart.findIndex(c=>c._id=req.params.id),1);
      res.cookie('cart', JSON.stringify(cart));
      res.redirect('back');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
const ITEMS_PER_PAGE = 6; // Adjust this value as needed
router.get("/products/weights/:page?", async function (req, res) {
  try {
    const page = parseInt(req.params.page) || 1;
    const selectedPrice = req.query.priceRange || "1000-50000"; // Get the selected price from query parameters
    const skipCount = (page - 1) * ITEMS_PER_PAGE;
    let totalCount = await Weight.countDocuments();
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const [minPrice, maxPrice] = selectedPrice.split('-');

    const weights = await Weight.find({
      price: {
        $gte: parseInt(minPrice),
        $lte: parseInt(maxPrice),
      }
    }).skip(skipCount).limit(ITEMS_PER_PAGE);

    res.render('products', {
      products: weights,
      productType: "weight",
      currentPage: page,
      totalPages: totalPages,
      selectedPrice: selectedPrice,
      minPrice: minPrice,
      maxPrice: maxPrice,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
