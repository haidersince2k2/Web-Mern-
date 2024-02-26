
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
