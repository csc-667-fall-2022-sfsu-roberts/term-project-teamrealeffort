var express = require('express');
const { request } = require('http');
var router = express.Router();
const verifyLogin = require('../db/verifyLogin');


/* GET home page. */
router.get('/', (req, res, next) =>  {
  res.render('login');
});

router.post('/', (req, res, next) =>  {
  const {email, password} = req.body; 

  if (verifyLogin.check({email, password})) {
  
  req.session.authenticated = true;   
  
  req.session.email = email; 

  console.log({email, password}); 

  res.redirect("/lobby"); 
  } 
});

module.exports = router;
