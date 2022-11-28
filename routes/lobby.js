var express = require('express');
const protect = require("../config/protect");
var router = express.Router();



/* GET home page. */
router.get('/', protect,  (req, res, next) =>  {
  const {sessionID} = req; 
  const {email} = req.session;  

  console.log(req.session); 
  console.log({sessionID, email}); 


  
  res.render('lobby', {sessionID, email});
});

module.exports = router;
