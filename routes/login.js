var express = require('express');
const { request } = require('http');
var router = express.Router();
const verifyLogin = require('../db/verifyLogin');


/* GET home page. */
router.get('/', (req, res, next) =>  {
  res.render('login');
});

router.post('/', (req, res, next) =>  {
  const {username, password} = req.body; 

  if (verifyLogin.check({username, password})) {
  
  req.session.authenticated = true;   
  
  req.session.username = username; 

  console.log({username, password}); 

  res.redirect("/lobby"); 
    
  } 
  

  

 
});

module.exports = router;
