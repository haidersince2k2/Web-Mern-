function checksessionauth(req,res,next){
    if (!req.session.user) {

      req.session.flash = { type: "warning", message: "Log in first" };  
        return res.redirect("/login");
      }
      next();
    }
module.exports=checksessionauth;