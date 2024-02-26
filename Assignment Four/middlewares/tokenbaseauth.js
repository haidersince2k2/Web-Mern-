module.exports = function (req, res, next) {
    const jwt = require("jsonwebtoken");
    const token = req.cookies.token;
  
    if (!token) {
      req.session.flash={type:"danger", message:"Login first"}
      return res.redirect('/login');
    }
  
    try {
      // Use the same secret key used for signing the token
      const decodedToken = jwt.verify(token, 'secret-key');
      console.log(decodedToken);
      req.user = decodedToken;
      console.log(req.user);

      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).send("Unauthorized");
    }
  };
  