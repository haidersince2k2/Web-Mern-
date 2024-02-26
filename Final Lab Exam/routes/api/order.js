const express = require("express");
let router = express.Router();
let Order = require("../../models/orders");
const checkadminauth = require("../../middlewares/admin");
const checksessionauth = require("../../middlewares/checksessionauth");






router.post('/orders',checksessionauth, async (req, res) => {
  try {
    const { username, email, address, contact, totalPrice, totalItems, date, items } = req.body;

    // Check if items is defined before attempting to split
    const itemsArray = items ? items.split(', ') : [];

    const newOrder = new Order({
      username,
      email,
      address,
      contact,
      totalPrice,
      totalItems,
      date,
      items: itemsArray,
    });

    // Validate the order data using the Order model's validate method
    // If validation passes, create a new order
    await newOrder.save();
    req.session.flash = { type: "success", message: "Order Placed Successfully." };
    res.clearCookie("cart");
    return res.redirect("/products/treadmills");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/order',checksessionauth, (req, res) => {
  const totalPrice = req.query.totalPrice;
  const totalitems = req.query.totalitems;

  // Check if 'array' query parameter exists
  if ('array' in req.query) {
      try {
          // Parse the JSON string into an array
          const array = JSON.parse(req.query.array);

          // Now you can use totalPrice, totalItems, and array in your server logic
          res.render('order', { totalPrice, totalitems, array });
      } catch (error) {
          console.error('Error parsing JSON:', error);
          // Handle the error appropriately
          res.status(500).send('Internal Server Error');
      }
  } else {
      // Handle the case where 'array' is not present in the query parameters
      res.status(400).send('Bad Request: Missing array parameter');
  }
});

module.exports = router;




