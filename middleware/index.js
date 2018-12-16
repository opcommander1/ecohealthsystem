var middleware = {};

//Function check to see if user is log in
middleware = function authenticationMiddleware() {
return (req, res, next) => {
  console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

    if (req.isAuthenticated()) return next();
    res.redirect('/login')
  }
}

module.exports = middleware;
