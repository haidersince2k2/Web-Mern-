const express = require("express");
let router = express.Router();
let Extra = require("../../models/extra");
const multer = require("multer");
const checksessionauth = require("../../middlewares/checksessionauth");
const checkadminauth = require("../../middlewares/admin");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.get("/extradelete/:id", async function (req, res) {
  
  let extra = await Extra.findByIdAndDelete(req.params.id);
  req.session.flash = {
    type: "danger",
    message: "Product Deleted Successfully.",
  };

  res.redirect('back');
});
router.get('/extracart/:id',checksessionauth, async function (req, res) {
  try {
    let extraItem = await Extra.findById(req.params.id);
    let cart = [];

    if (req.cookies.cart) {
      cart = JSON.parse(req.cookies.cart);
      if (!Array.isArray(cart)) {
        cart = [];
      }
    }

    
    const { _id,title, price } = extraItem;
    cart.push({ _id,title, price, type:"extra" });
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

router.post("/update/extra/:id",checkadminauth, upload.single("image"), async function (req, res) {
  try {
    const { title, price } = req.body;
    const productId = req.params.id;

    // Find the existing Extra record by ID
    const existingExtra = await Extra.findById(productId);

    if (!existingExtra) {
      return res.status(404).send('Extra not found');
    }

    // Update the existing Extra record
    existingExtra.title = title;
    existingExtra.price = price;

    // Check if a new image is provided
    if (req.file) {
      existingExtra.imageData = req.file.buffer;
    }

    await existingExtra.save();
    req.session.flash = {
      type: "success",
      message: "Product Updated Successfully.",
    };
    
    res.redirect("/products/extras");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/extracart/remove/:id', async function (req, res) {
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
      res.redirect('/cart');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


router.post("/extra", checkadminauth,upload.single("image"), async function (req, res) {
  try {
    const { title, price,producttype,color } = req.body;
    const imageData = req.file.buffer;
    
    let extra = new Extra({
      title: title,
      price: price,
      producttype:producttype,
      color:color,
      imageData: imageData,
    });

    await extra.save();
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

const ITEMS_PER_PAGE = 6; // Adjust this value as needed
router.get("/products/extras/:page?", async function (req, res) {
  try {
    const page = parseInt(req.params.page) || 1;
    const selectedPrice = req.query.priceRange || "1000-50000"; // Get the selected price from query parameters
    const skipCount = (page - 1) * ITEMS_PER_PAGE;
    let totalCount = await Extra.countDocuments();
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const [minPrice, maxPrice] = selectedPrice.split('-');

    const extras = await Extra.find({
      price: {
        $gte: parseInt(minPrice),
        $lte: parseInt(maxPrice),
      }
    }).skip(skipCount).limit(ITEMS_PER_PAGE);

    res.render('products', {
      products: extras,
      productType: "extra",
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




