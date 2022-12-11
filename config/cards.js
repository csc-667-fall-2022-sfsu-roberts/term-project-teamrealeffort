// 10: Draw Two
// 11: Draw Four
// 12: Wild
// 13: Reverse
// 14: Skip
const DRAW_TWO = 10;
const DRAW_FOUR = 11;
const WILD = 12;
const REVERSE = 13;
const SKIP = 14;

const SINGLE_COLOR_CARD_TYPES = [0];

const DUAL_COLOR_CARD_TYPES = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  DRAW_TWO,
  REVERSE,
  SKIP,
];

const NO_COLOR_CARD_TYPES = [DRAW_FOUR, WILD];

const BLUE = "blue";
const YELLOW = "yellow";
const RED = "red";
const GREEN = "green";
const NONE = "none";

const CARD_COLORS = { BLUE, YELLOW, RED, GREEN, NONE };

module.exports = {
  SINGLE_COLOR_CARD_TYPES,
  DUAL_COLOR_CARD_TYPES,
  NO_COLOR_CARD_TYPES,
  CARD_COLORS,
};
