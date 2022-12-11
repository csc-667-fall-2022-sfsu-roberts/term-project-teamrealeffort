const { response } = require('express');
var express = require('express');
const { request } = require('http');
var router = express.Router();

router.post('/:id', (req, res, next) => {
  
  const { id } = req.params;
  const { message } = req.body;
  const { email } = req.session;
  const timestamp = Date.now();
  console.log("id "+id)
  req.app.io.emit(`chat:${id}`, {
    sender: email,
    message:message,
    timestamp:timestamp,
  });
  
  res.sendStatus(200);
});

module.exports = router;