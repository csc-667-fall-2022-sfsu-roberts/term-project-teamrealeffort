const db = require("./index");

const CREATE_SQL = "INSERT INTO games (title) VALUES(${title}) RETURNING id";
const ADD_USER_SQL = "INSERT INTO game_users (user_id, game_id) VALUES(${user_id}, ${game_id}) RETURNING game_id";
const CHECK_USER_IN_GAME_SQL = "SELECT * FROM game_users WHERE user_id =${user_id}";
const LIST_SQL = "select * from games"

const create = (user_id, title) => {
  console.log("Title: " + title);

  return db
    .one(CREATE_SQL, { title })
    .then(({ id: game_id }) => addUser(user_id, game_id));
}

const addUser = (user_id, game_id) => {
  return db.one(ADD_USER_SQL, { user_id, game_id })
};

// need to figure out better error handling than this for when
// user is already in a game so they aren't readded

/*
const addUser = (user_id, game_id) => {
  return db
    .none(CHECK_USER_IN_GAME_SQL, { user_id })
    .then(() => db.one(ADD_USER_SQL, { user_id, game_id }));
}
*/

const all = () => {
  return db.any(LIST_SQL).then((games) => {
    return games;
  }).catch((e)=>{console.log(e)});
};
module.exports = { create, addUser, all };