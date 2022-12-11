const express = require('express');
const protect = require('../config/protect');
const router = express.Router();

router.get("/:id", (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  res.render("games", { id });
});

router.get("/:id/:message", (req, res) => {
  const { id, message } = req.params;
  res.render("games", { id, message });
});

module.exports = router;