const db = require("./index");

const CREATE_SQL = "INSERT INTO games (title) VALUES (${title}) RETURNING id";

const CHECK_USER_IN_GAME_SQL =
  "SELECT * FROM game_users WHERE user_id=${user_id} AND game_id = ${game_id}";

const ADD_USER_SQL =
  "INSERT INTO game_users (game_id, user_id) VALUES (${game_id}, ${user_id}) RETURNING game_id";

const ACTIVE_GAMES =
  "SELECT id, title FROM games LEFT JOIN game_users ON games.id = game_users.game_id WHERE game_users.user_id=${user_id}";

const JOINABLE_GAMES =
  "SELECT * FROM games WHERE id NOT IN (" +
  "SELECT id FROM games LEFT JOIN game_users ON games.id = game_users.game_id WHERE game_users.user_id=${user_id}" +
  ")";

const COUNT_USERS_IN_GAME =
  "SELECT COUNT(*) FROM game_users WHERE game_id = ${game_id}";

const GAME_INFO = "SELECT * FROM GAMES WHERE id = ${game_id}";

const create = (user_id, title = "") => {
  return db
    .one(CREATE_SQL, { title })
    .then(({ id: game_id }) => addUser(user_id, game_id));
};

const addUser = (user_id, game_id) => {
  return db
    .none(CHECK_USER_IN_GAME_SQL, { user_id, game_id })
    .then(() => db.one(ADD_USER_SQL, { user_id, game_id }));
};

const active = (user_id) => db.any(ACTIVE_GAMES, { user_id });

const joinable = (user_id) => db.any(JOINABLE_GAMES, { user_id });

const all = (user_id) =>
  Promise.all([active(user_id), joinable(user_id)]).then(
    ([active, joinable]) => ({ active, joinable })
  );

const info = (game_id) => db.one(GAME_INFO, { game_id });
const userCount = (game_id) => db.one(COUNT_USERS_IN_GAME, { game_id });

const GET_PLAYERS =
  "SELECT users.id, users.username, game_users.seat, game_users.current, (SELECT COUNT(*)::int FROM game_cards WHERE game_id=${game_id} AND user_id=users.id) as card_count FROM users, game_users WHERE game_users.game_id=${game_id} AND users.id=game_users.user_id";

const getPlayers = (game_id) => db.any(GET_PLAYERS, { game_id });

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const getCanonicalCards = () => db.any("SELECT * FROM cards");
const insertCard = (game_id, card_id) =>
  db.one(
    "INSERT INTO game_cards (game_id, card_id, user_id) VALUES (${game_id}, ${card_id}, 0) RETURNING *",
    { game_id, card_id }
  );
const discardCard = (game_id, card_id) =>
  db.none(
    "UPDATE game_cards SET user_id=-1 WHERE game_id=${game_id} AND card_id=${card_id}",
    { game_id, card_id }
  );

const playerDiscard = (game_id, card_id, discard_id) =>
  db
    .none(
      "UPDATE game_cards SET user_id=-2 WHERE game_id=${game_id} AND card_id=${discard_id}",
      { game_id, discard_id }
    )
    .then(() => discardCard(game_id, card_id));

const initDeck = (game_id) =>
  getCanonicalCards()
    .then((cards) => shuffle(cards))
    .then((cards) => {
      return Promise.all(cards.map(({ id }) => insertCard(game_id, id)));
    })
    .then((game_cards) => {
      return Promise.all([
        game_cards,
        discardCard(game_id, game_cards[0].card_id),
      ]);
    })
    .then(([game_cards]) => game_cards);

const getNextDrawableCards = (game_id, limit) =>
  db.any(
    "SELECT * FROM game_cards WHERE game_id=${game_id} AND user_id=0 LIMIT ${limit}",
    { game_id, limit }
  );

const assignCard = (data) =>
  db.none(
    "UPDATE game_cards SET user_id=${user_id} WHERE card_id=${card_id} AND game_id=${game_id}",
    data
  );

const setPlayerSeat = (game_id, user_id, seat) =>
  db.any(
    "UPDATE game_users SET seat=${seat}, current=${current} WHERE game_id=${game_id} AND user_id=${user_id}",
    { seat, current: seat === 0, game_id, user_id }
  );

const getPlayerHand = (game_id, user_id) =>
  db.any(
    "SELECT * FROM game_cards, cards WHERE game_cards.user_id=${user_id} AND game_cards.game_id=${game_id} AND cards.id=game_cards.card_id",
    { game_id, user_id }
  );

const getCurrentDiscard = (game_id) =>
  db.one(
    "SELECT * FROM game_cards, cards WHERE game_cards.user_id=-1 AND game_id=${game_id} AND cards.id=game_cards.card_id",
    { game_id }
  );

const isUserInGame = (game_id, user_id) =>
  db
    .one(
      "SELECT * FROM game_users WHERE game_id=${game_id} AND user_id=${user_id}",
      { game_id, user_id }
    )
    .then(() => true)
    .catch(() => false);

const isUsersTurn = (game_id, user_id) =>
  db
    .one(
      "SELECT current FROM game_users WHERE game_id=${game_id} AND user_id=${user_id}",
      { game_id, user_id }
    )
    .then(({ current }) => current);

const userHasCard = (game_id, user_id, card_id) =>
  db
    .one(
      "SELECT * FROM game_cards WHERE game_id=${game_id} AND user_id=${user_id} AND card_id=${card_id}",
      { game_id, user_id, card_id }
    )
    .then(() => true)
    .catch(() => false);

const getCard = (card_id) =>
  db.one("SELECT * FROM cards WHERE id=${card_id}", { card_id });

const setNextPlayer = (game_id, user_id) =>
  db
    .one(
      "SELECT seat FROM game_users WHERE game_id=${game_id} AND user_id=${user_id}",
      { game_id, user_id }
    )
    .then(({ seat }) =>
      Promise.all([
        db.none(
          "UPDATE game_users SET current=false WHERE game_id=${game_id} AND user_id=${user_id}",
          { game_id, user_id }
        ),
        db.none(
          "UPDATE game_users SET current=true WHERE game_id=${game_id} AND seat=${seat}",
          { game_id, seat: (seat + 1) % 2 } // TODO: that 2 should come from number of players in game
        ),
      ])
    );

const drawCard = (game_id, user_id) =>
  db
    .one(
      "SELECT COUNT(*)::int FROM game_cards WHERE game_id=${game_id} AND user_id=0",
      { game_id }
    )
    .then(({ count }) => {
      if (count <= 1) {
        // TODO shuffle discarded
      } else {
        return Promise.resolve();
      }
    })
    .then(() => getNextDrawableCards(game_id, 1))
    .then(([{ card_id }]) => assignCard({ game_id, user_id, card_id }));

module.exports = {
  create,
  all,
  addUser,
  userCount,
  info,
  getPlayers,
  initDeck,
  getNextDrawableCards,
  assignCard,
  setPlayerSeat,
  getPlayerHand,
  getCurrentDiscard,
  isUserInGame,
  isUsersTurn,
  userHasCard,
  getCard,
  playerDiscard,
  setNextPlayer,
  drawCard,
};
