const Games = require("../db/games");

const INITIAL_CARD_COUNT = 5;

const setSeats = (game_id) => (players) =>
  Promise.all(
    players.map((player, index) =>
      Games.setPlayerSeat(game_id, player.id, index)
    )
  ).then(() => players);

const assignCards =
  (game_id) =>
  ([players, cardsThatNeedAssignment]) =>
    Promise.all([
      players,
      ...players.reduce((memo, player, index) => {
        for (let i = 0; i < INITIAL_CARD_COUNT; i++) {
          memo.push(
            Games.assignCard({
              user_id: player.id,
              card_id:
                cardsThatNeedAssignment[index * INITIAL_CARD_COUNT + i].card_id,
              game_id,
            })
          );
        }

        return memo;
      }, []),
    ]);

const drawInitialCards = (game_id) => (players) =>
  Promise.all([
    players,
    Games.getNextDrawableCards(game_id, players.length * INITIAL_CARD_COUNT),
  ]);

const initialize = (game_id) => {
  return Games.initDeck(game_id)
    .then(() => Games.getPlayers(game_id))
    .then(setSeats(game_id))
    .then(drawInitialCards(game_id))
    .then(assignCards(game_id));
};

module.exports = initialize;