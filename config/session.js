const session = require("express-session");

const sessionInstance = session({
  secret: "eofdhqoiehdgkadkq",
  cookie: { maxAge: Date.now() + (24 * 60 * 60) },
  resave: false,
  saveUninitialized: true,
  httpOnly: true,
});

module.exports = sessionInstance; 