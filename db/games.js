const db = require("./index");

const CREATE_SQL = "INSERT INTO games (title) VALUES(${title}) RETURNING id";
const ADD_USER_SQL = "INSERT INTO game_users (user_id, game_id) VALUES(${user_id}, ${game_id}) RETURNING game_id";
const LIST_SQL = "SELECT * FROM games"
const USER_ID = "SELECT id FROM users WHERE email = ${email}";

const create = (user_id, title) => {
  console.log("Title: " + title);

  return db
    .one(CREATE_SQL, { title })
    .then(({ id: game_id }) => addUser(user_id, game_id));
}

const addUser = (user_id, game_id) => {
  console.log("user_id: " + user_id);
  console.log("game_id: " + game_id);
  return db.one(ADD_USER_SQL, { user_id, game_id });
}

const all = () => db.any(LIST_SQL);

module.exports = { create, all, addUser}