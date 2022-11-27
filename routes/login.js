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

  verifyLogin.check({email, password})
  .then(({id}) => {

    req.session.authenticated = true;   
  

    req.session.userId = id; 
    
    req.session.email = email; 
  
    console.log({email, password}); 
  
    res.redirect("/lobby"); 


  }).catch((error) => {

   console.log({error}); 
   res.redirect('login'); 

  }); 


}); 
  
  
module.exports = router;
