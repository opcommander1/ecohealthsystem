var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated(){
    return();
  }
  res.redirect("/login");
  })
};

module.exports = middlewareObj;
