const express = require('express');
const router = express.Router();
const Games = require("../../db/games");

router.post('/create', (req, res) => {
  const user_id = req.session;
  const { title = "" } = req.body;
  
  Games.create(user_id, title)
  .then(({ game_id }) => {
    res.redirect(`/games/${game_id}`);

    request.app.io.emit("game:created", {
      game_id, title,
    });
  }).catch((error) => {
    console.log("THIS IS THE ERROR");
    console.log(error);
  });
});

module.exports = router;
