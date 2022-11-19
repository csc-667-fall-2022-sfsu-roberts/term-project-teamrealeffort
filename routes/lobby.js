var express = require('express');
const protect = require("../config/protect");
var router = express.Router();



/* GET home page. */
router.get('/', protect,  (req, res, next) =>  {
  const {sessionID} = req; 
  const {username} = req.session;  



  console.log(req.session); 
  console.log({sessionID, username}); 


  
  res.render('lobby', {sessionID, username});
});

module.exports = router;
