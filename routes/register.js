
const { response } = require('express');
const Users = require('../db/users'); 
var express = require('express');
const { request } = require('http');
var router = express.Router();
const db = require('../db');


/* GET home page. */
router.get('/', (req, res, next)  => {
 
  res.render('register');
});

router.post('/', (req, res, next) => { 
  const {username, password, email} = req.body; 

  Users.register({username, password, email })
   .then(({id, username})=> { 

  
    req.session.userId = id; 
    req.session.username= username; 
    req.session.authenticated = true; 

    console.log({id, username, password, email}); 


    res.redirect('/login'); 

   })
   .catch(error => { 
    console.log({error}); 
    res.redirect('/register'); 
   }); 

 
}); 

module.exports = router;