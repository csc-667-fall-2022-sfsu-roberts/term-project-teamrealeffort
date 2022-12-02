const express = require('express');
const protect = require('../config/protect');

const router = express.Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;
  response.render("/game", { id });
});

router.get("/:id/:message", (req, res) => {
  const { id, message } = req.params;
  response.render("/game", { id, message });
});

module.exports = router;