const express = require("express");
let router = express.Router();
const multer = require("multer");
let Mat = require("../../models/mat");
const checksessionauth = require("../../middlewares/checksessionauth");
const checkadminauth = require("../../middlewares/admin");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const ITEMS_PER_PAGE = 6; // Adjust this value as needed
router.get("/products/mats/:page?", async function (req, res) {
  try {
    const page = parseInt(req.params.page) || 1;
    const selectedPrice = req.query.priceRange || "1000-50000"; // Get the selected price from query parameters
    const skipCount = (page - 1) * ITEMS_PER_PAGE;
    let totalCount = await Mat.countDocuments();
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const [minPrice, maxPrice] = selectedPrice.split('-');

    const mats = await Mat.find({
      price: {
        $gte: parseInt(minPrice),
        $lte: parseInt(maxPrice),
      }
    }).skip(skipCount).limit(ITEMS_PER_PAGE);

    res.render('products', {
      products: mats,
      productType: "mat",
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



router.get("/matdelete/:id", async function (req, res) {
  // return res.send(req.params);
  let mat1 = await Mat.findByIdAndDelete(req.params.id);
  req.session.flash = {
    type: "danger",
    message: "Product Deleted Successfully.",
  };

  res.redirect("back");
});



router.get('/matcart/:id',checksessionauth, async function (req, res) {
  try {
    let mat1l = await Mat.findById(req.params.id);
    let cart = [];

    if (req.cookies.cart) {
      cart = JSON.parse(req.cookies.cart);
      if (!Array.isArray(cart)) {
        cart = [];
      }
    }

    // Only store title and price in the cart
    const { _id,title, price } = mat1l;
    cart.push({ _id,title, price, type:"mat" });
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

router.get('/matcart/remove/:id', async function (req, res) {
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


router.post("/mat",checkadminauth, upload.single("image"), async function (req, res) {
  try {
    const { title, price,producttype,color } = req.body;
    const imageData = req.file.buffer;
    
    let mat = new Mat({
      title: title,
      price: price,
      producttype:producttype,
      color:color,
      imageData: imageData,
    });

    await mat.save();
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

router.post("/update/mat/:id",checkadminauth, upload.single("image"), async function (req, res) {
  try {
    const { title, price } = req.body;
    const productId = req.params.id;

    // Find the existing Mat record by ID
    const existingMat = await Mat.findById(productId);

    if (!existingMat) {
      return res.status(404).send('Mat not found');
    }

    // Update the existing Mat record
    existingMat.title = title;
    existingMat.price = price;

    // Check if a new image is provided
    if (req.file) {
      existingMat.imageData = req.file.buffer;
    }

    await existingMat.save();
    req.session.flash = {
      type: "success",
      message: "Product Updated Successfully.",
    };
    
    res.redirect("/products/mats");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
