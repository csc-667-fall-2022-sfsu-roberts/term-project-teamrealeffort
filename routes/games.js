const express = require("express");

const router = express.Router();
const Games = require("../db/games");
const GameLogic = require("../game-logic");
const CARDS = require("../config/cards");
const PLAYERS = 2
router.post("/create", (request, response) => {
  const { user_id } = request.session;
  const { title = "" } = request.body;

  Games.create(user_id, title)
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
  const { user_id } = request.session;
  console.log("The userID is " + user_id);
  response.json({ game_id, user_id: user_id });
});

router.post("/:id/draw", (request, response) => {
  const { id: game_id } = request.params;
  const { user_id } = request.session;
  console.log("Player " + user_id + " is drawing a card.");

  Games.drawCard(game_id, user_id)
    .then(() => Games.setNextPlayer(game_id, user_id))
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
      console.log("PLAYERS:"+PLAYERS)
      console.log("CURRENT PLAYER:"+count)
      console.log(parseInt(count) < PLAYERS)
      if (parseInt(count) > PLAYERS) {
        console.log("There should be a error")
        throw "room already full"
      }

      response.render("games", {
        id,
        title,
        count,
        required_count: PLAYERS,
        ready: parseInt(count) === PLAYERS,
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
  const { user_id } = request.session;
  const { id } = request.params;
  Games.isUserInGame(id, user_id)
    .then((isUserInGame) => {
      if (isUserInGame) {
        response.redirect(`/games/${id}`);
      } else {
        Games.addUser(user_id, id)
          .then(() => Games.userCount(id))
          .then(({ count }) => {
            request.app.io.emit(`game:${id}:player-joined`, {
              count: parseInt(count),
              required_count: PLAYERS,
            });

            if (parseInt(count) === PLAYERS) {
              GameLogic.initialize(id).then(() =>
                GameLogic.status(id, request.app.io)
              );
            }

            response.redirect(`/games/${id}`);
          })
          .catch((error) => {
            console.log("JOIN ERROR!");
            console.log({ error });
          });
      }
    })

});

router.post("/:id/play", (request, response) => {
  const { user_id } = request.session;
  const { id: game_id } = request.params;
  const { card_id } = request.body;
  var { plainCard } = "";
  var { newlyDiscard } = "";
  console.log("Checking if " + user_id + " is in game...")
  // Check that the user is in the game
  // If not, ignore
  Games.isUserInGame(game_id, user_id)
    .then((isUserInGame) => {
      if (isUserInGame) {
        return Promise.resolve();
      } else {
        return Promise.reject(`${user_id} not in game`);
      }
    })
    // Check that its the users turn
    // If not, ignore
    .then(() => Games.isUsersTurn(game_id, user_id))
    .then((isUsersTurn) => {
      if (isUsersTurn) {
        return Promise.resolve();
      } else {
        return Promise.reject(`not ${user_id}'s turn`);
      }
    })

    // Check the card that is being played is held by the user
    // If not, ignore
    .then(() => Games.userHasCard(game_id, user_id, card_id))
    .then((userHasCard) => {
      if (userHasCard) {
        return Promise.resolve();
      } else {
        return Promise.reject(`${user_id} does not hold ${card_id}`);
      }
    })
    // Check the card that is being played is a valid play
    // If not, broadcast an error to user
    .then(() =>
      Promise.all([Games.getCard(card_id), Games.getCurrentDiscard(game_id)])
    )
    .then(([card, discard]) => {
      plainCard = card;
      console.log("CARD TYPE: " + card.type);
      console.log("CARD COLOR: " + card.color);
      console.log("DISCARD COLOR: " + discard.color);
      console.log("DISCARD TYPE: " + discard.type);
      if (
        CARDS.NO_COLOR_CARD_TYPES.includes(card.type) ||
        card.color === discard.color ||
        card.type === discard.type ||
        discard.color === "none" ||
        card.color === "none"
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
      Games.playerDiscard(game_id, card.id, discard.id))
    .then(() => Games.isGameOver(game_id, user_id))
    .then((isGameOver) => {
      if (isGameOver) {
        console.log(`Player ${user_id} has won!`);
        return Promise.resolve(`Player ${user_id} has won!`);
      }
    })
    .then(() => {
      console.log("\nType: " + plainCard.type);
      if (plainCard.type === 10) {
        Games.setNextPlayer(game_id, user_id);
        Games.drawCard(game_id, user_id);
        Games.drawCard(game_id, user_id);
        GameLogic.status(game_id, request.app.io);
      } else if (plainCard.type === 11) {
        Games.setNextPlayer(game_id, user_id);
        Games.drawCard(game_id, user_id);
        Games.drawCard(game_id, user_id);
        Games.drawCard(game_id, user_id);
        Games.drawCard(game_id, user_id);
        GameLogic.status(game_id, request.app.io);
      } else if (plainCard.type === 14) {
        Games.setNextPlayer(game_id, user_id);
        GameLogic.status(game_id, request.app.io);
      }
    })
    .then(() => Games.setNextPlayer(game_id, user_id))
    .then(() => GameLogic.status(game_id, request.app.io))
    .catch((error) => {
      console.log({ error });
      response.status(200).send();
    });
});

module.exports = router;