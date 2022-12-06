var express = require('express');
const protect = require("../config/protect");
const Games = require('../db/games');
var router = express.Router();

router.get('/', protect, (req, res, next) => {
  const { sessionID } = req;
  const { email, user_id } = req.session;
  Games.all()
    .then((games) => {
      console.log({ games });
      res.render('lobby', { email, user_id, games });
    }).catch((error) => {
      console.log(error);
    });
});

module.exports = router;
