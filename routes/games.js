const express = require("express");

const router = express.Router();
const Games = require("../db/games");
const GameLogic = require("../game-logic");
const CARDS = require("../config/cards");

router.post("/create", (request, response) => {
  const { userId } = request.session;
  const { title = "" } = request.body;

  Games.create(userId, title)
    .then(({ game_id }) => {
      response.redirect(`/games/${game_id}`);

      request.app.io.emit("game:created", {
        game_id,
        title,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/:id", (request, response) => {
  const { id: game_id } = request.params;
  const { userId } = request.session;

  response.json({ game_id, user_id: userId });
});

router.post("/:id/draw", (request, response) => {
  const { id: game_id } = request.params;
  const { userId } = request.session;

  Games.drawCard(game_id, userId)
    .then(() => Games.setNextPlayer(game_id, userId))
    .then(() => GameLogic.status(game_id, request.app.io));
});

router.post("/:id/status", (request, response) => {
  const { id: game_id } = request.params;

  GameLogic.status(game_id, request.app.io);

  response.status(200).send();
});

router.get("/:id", (request, response) => {
  const { id } = request.params;

  Promise.all([Games.userCount(id), Games.info(id)])
    .then(([{ count }, { title }]) => {
      response.render("games", {
        id,
        title,
        count,
        required_count: 2,
        ready: parseInt(count) === 2,
      });
    })
    .catch((error) => {
      console.log(error);
      response.status(500).send();
    });
});

router.get("/:id/:message", (request, response) => {
  const { id, message } = request.params;

  response.render("games", { id, message });
});

router.post("/:id/join", (request, response) => {
  const { userId } = request.session;
  const { id } = request.params;

  Games.addUser(userId, id)
    .then(() => Games.userCount(id))
    .then(({ count }) => {
      request.app.io.emit(`game:${id}:player-joined`, {
        count: parseInt(count),
        required_count: 2,
      });

      if (parseInt(count) === 2) {
        GameLogic.initialize(id).then(() =>
          GameLogic.status(id, request.app.io)
        );
      }

      response.redirect(`/games/${id}`);
    })
    .catch((error) => {
      console.log({ error });
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