const db = require("./index");

const VERIFY_USER = "SELECT (email, password, id) FROM users WHERE email = ${email} AND password = ${password}";

const check = ({ email, password }) => {
  return db.one(VERIFY_USER, { email, password});
};

module.exports = { check }; 