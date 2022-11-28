const { response } = require('express');
var express = require('express');
const { request } = require('http');
var router = express.Router();



/* GET home page. */
router.post('/:id',  (req, res, next) =>  {

    const{id} = req.params; 
    const {message} = req.body; 
    const {email} = req.session; 
    const timestamp = Date.now(); 


    req.app.io.emit(`chat:${id}`, {
       sender: email, 
       message, 
       timestamp,
    
    });
   
  
    res.sendStatus(200); 
});

module.exports = router;
