const db = require("./index");

const VERIFY_USER = "SELECT id, email, password FROM users WHERE email = ${email} AND password = ${password}";

const check = ({ id, email, password }) => {
  return db.one(VERIFY_USER, { id, email, password });
};

module.exports = { check }; 