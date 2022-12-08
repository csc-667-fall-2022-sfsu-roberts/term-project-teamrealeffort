const { response } = require('express');
const Users = require('../db/users');
var express = require('express');
var router = express.Router();
const db = require('../db');

router.get('/', (req, res, next) => {
  res.render('register');
});

router.post('/', (req, res, next) => {
  const { username, password, email } = req.body;
  
  Users.register({ username, password, email })
    .then(({ id, username }) => {
      
      req.session.user_id = id;
      req.session.username = username;
      req.session.authenticated = true;
      console.log({ username, password, email , id});

      res.redirect('/login');
    })
    .catch(error => {
      console.log({ error });
      res.redirect('/register');
    });
});

module.exports = router;
