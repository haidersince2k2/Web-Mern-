const express = require("express");
const multer = require("multer");

const router = express.Router();
const Tread = require("../../models/treadmills");
const checksessionauth = require("../../middlewares/checksessionauth");
const checkadminauth = require("../../middlewares/admin");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });




router.post("/treadmill",checkadminauth, upload.single("image"), async function (req, res) {
  try {
    const { title, price,producttype,color } = req.body;
    const imageData = req.file.buffer;
    

    let treadmil = new Tread({
      title: title,
      price: price,
      producttype:producttype,
      color:color,
      imageData: imageData,
    });

    await treadmil.save();
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
router.post("/update/treadmill/:id",checkadminauth, upload.single("image"), async function (req, res) {
  try {
    const { title, price } = req.body;
    const productId = req.params.id;

    // Find the existing Treadmill record by ID
    const existingTreadmill = await Tread.findById(productId);

    if (!existingTreadmill) {
      return res.status(404).send('Treadmill not found');
    }

    // Update the existing Treadmill record
    existingTreadmill.title = title;
    existingTreadmill.price = price;

    // Check if a new image is provided
    if (req.file) {
      existingTreadmill.imageData = req.file.buffer;
    }

    await existingTreadmill.save();
    req.session.flash = {
      type: "success",
      message: "Product Updated Successfully.",
    };
    
    res.redirect("/products/treadmills");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const ITEMS_PER_PAGE = 6; // Adjust this value as needed
router.get("/products/treadmills/:page?", async function (req, res) {
  try {
    const page = parseInt(req.params.page) || 1;
    const selectedPrice = req.query.priceRange || "1000-50000"; // Get the selected price from query parameters
    const skipCount = (page - 1) * ITEMS_PER_PAGE;
    let totalCount = await Tread.countDocuments();
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const [minPrice, maxPrice] = selectedPrice.split('-');
    
    const treadmil = await Tread.find({
      price: {
        $gte: parseInt(minPrice),
        $lte: parseInt(maxPrice),
      }
    }).skip(skipCount).limit(ITEMS_PER_PAGE);
    
    res.render('products', {
      products: treadmil,
      productType: "treadmill",
      currentPage: page,
      totalPages: totalPages,
      selectedPrice: selectedPrice, 
      minPrice:minPrice,
      maxPrice:maxPrice,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



router.get("/treadmilldelete/:id", async function (req, res) {
  try {
    let treadmil = await Tread.findByIdAndDelete(req.params.id);
    req.session.flash = {
      type: "danger",
      message: "Product Deleted Successfully.",
    };
    res.redirect("back");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/treadmillcart/:id',checksessionauth,async function (req, res) {
  try {
    let treadmill = await Tread.findById(req.params.id);
    let cart = [];

    if (req.cookies.cart) {
      cart = JSON.parse(req.cookies.cart);
      if (!Array.isArray(cart)) {
        cart = [];
      }
    }

    // Only store title and price in the cart
    const { _id,title, price } = treadmill;
    cart.push({ _id,title, price, type:"treadmill" });
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

router.get('/treadmillcart/remove/:id', async function (req, res) {
  try {
    let cart = [];
    if (req.cookies.cart) {
      cart = JSON.parse(req.cookies.cart);
      if (!Array.isArray(cart)) {
        cart = [];
      }
    }

    const indexToRemove = cart.findIndex(c => c._id === req.params.id);
    if (indexToRemove !== -1) {
      cart.splice(indexToRemove, 1);
    }

    res.cookie('cart', JSON.stringify(cart));
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
