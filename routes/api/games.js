const express = require('express');
const router = express.Router();
const Games = require("../../db/games");

router.post('/create', (req, res) => {
  const { user_id } = req.session;
  const { title = "" } = req.body;
  console.log({user_id});
  Games.create(user_id, title)
    .then(({ game_id }) => {
      res.redirect(`/games/${game_id}`);

      req.app.io.emit("game:created", {
        game_id, title,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/:id/join', (req, res) => {
  const { user_id } = req.session;
  const { id } = req.params;

  Games.addUser(user_id, id).then(() => {
    res.redirect(`/games/${id}`);
  }).catch((error) => {
    console.log(error);
  });
});

router.post("/:id/play", (req, res) => {
  const {user_id } = req.session;
  const {id} = req.params;

  // Check that the user is in the game
    //if not ignore

  // Check that its the users turn
    //if not ignore

  // Check the card that is being played is held by the user
    // if not broadcast an error to user 

  // Check the card that is being played is a valid play
    // if not broadcast an error to user

  // If all of these things are true, update game state and broadcast
    // remove card from user's hand
    // add card to discard pile
    // change current user
    // broadcast game state
});

module.exports = router;
