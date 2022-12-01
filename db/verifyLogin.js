const db = require("./index");

const VERIFY_USER = 'SELECT ("email", "password") FROM "user" WHERE "email" = ${email} AND "password" = ${password}';
const GET_ID = "SELECT user_id FROM user";
const check = ({ email, password }) => {
  console.log("USER ID: " + GET_ID);
  return db.one(VERIFY_USER, { email, password });
};

module.exports = { check }; 
