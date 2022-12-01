const db = require("./index");

const REGISTER_USER = 'INSERT INTO "user" ("username", "password", "email") VALUES (${username}, ${password}, ${email}) RETURNING "user_id" ';

const register = ({ username, password, email }) => {
  return db.one(REGISTER_USER, { username, password, email });
};

module.exports = { register }; 