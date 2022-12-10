const md5 = require("md5");
const Games = require("../db/games");

const status = (game_id, io) => {
  return Games.getPlayers(game_id)
    .then((players) => players.map((p) => ({ ...p, avatar: md5(p.username) })))
    .then((players) =>
      Promise.all(players.map((player) => userStatus(game_id, player, players)))
    )
    .then((messages) =>
      messages.forEach((message) => {
        io.to(message.player_id).emit(`game:${game_id}:update`, message);
      })
    );
};

const userStatus = (game_id, player, players) => {
  return Games.getCurrentDiscard(game_id)
    .catch(() => Promise.resolve(undefined))
    .then((discard) =>
      Promise.all([Games.getPlayerHand(game_id, player.id), discard])
    )
    .then(([hand, discard]) => ({
      id: game_id,
      player_id: player.id,
      players,
      isMyTurn: player.current,
      hand,
      discard,
    }));
};

module.exports = status;