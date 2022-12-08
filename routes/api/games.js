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

router.post("/:id/play", (request, response) => {
  const { userId } = request.session;
  const { id: game_id } = request.params;
  const { card_id } = request.body;

  // Check that the user is in the game
  // If not, ignore
  Games.isUserInGame(game_id, userId)
    .then((isUserInGame) => {
      if (isUserInGame) {
        return Promise.resolve();
      } else {
        return Promise.reject(`${userId} not in game`);
      }
    })
    // Check that its the users turn
    // If not, ignore
    .then(() => Games.isUsersTurn(game_id, userId))
    .then((isUsersTurn) => {
      if (isUsersTurn) {
        return Promise.resolve();
      } else {
        return Promise.reject(`not ${userId}'s turn`);
      }
    })
    // Check the card that is being played is held by the user
    // If not, ignore
    .then(() => Games.userHasCard(game_id, userId, card_id))
    .then((userHasCard) => {
      if (userHasCard) {
        return Promise.resolve();
      } else {
        return Promise.reject(`${userId} does not hold ${card_id}`);
      }
    })
    // Check the card that is being played is a valid play
    // If not, broadcast an error to user
    .then(() =>
      Promise.all([Games.getCard(card_id), Games.getCurrentDiscard(game_id)])
    )
    .then(([card, discard]) => {
      if (
        CARDS.NO_COLOR_CARD_TYPES.includes(card.type) ||
        card.color === discard.color ||
        card.type === discard.type
      ) {
        return Promise.resolve({ card, discard });
      } else {
        return Promise.reject(`${card.id} can not be played on ${discard.id}`);
      }
    })
    // If all of that is true, update game state and broadcast
    // Remove the card from user's hand
    // Add card to discard pile
    .then(({ card, discard }) =>
      Games.playerDiscard(game_id, card.id, discard.id)
    )
    // Change current user
    .then(() => Games.setNextPlayer(game_id, userId))
    // Broadcast game state
    .then(() => GameLogic.status(game_id, request.app.io))
    .catch((error) => {
      console.log({ error });
      response.status(200).send();
    });
});

module.exports = router;
