var express = require('express');
const protect = require("../config/protect");
var router = express.Router();

router.get('/', protect, (req, res, next) => {
  const { sessionID } = req;
  const { email, userId } = req.session;

  console.log({ sessionID, email, userId});

  res.render('lobby', { sessionID, email , userId});
});

module.exports = router;
