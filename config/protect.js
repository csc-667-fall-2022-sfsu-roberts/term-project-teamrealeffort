const protect = (req, res, next) => {
  if (req.session.authenticated) {
    next();
  }
  else {
    res.redirect("login");
  }
}

module.exports = protect; 