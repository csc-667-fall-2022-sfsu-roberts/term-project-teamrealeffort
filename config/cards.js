const DRAW_TWO = 10;
const WILD_DRAW_FOUR = 11;
const WILD = 12;
const REVERSE = 13;
const SKIP = 14;

const BLUE = "blue";
const GREEN = "green";
const YELLOW = "yellow";
const RED = "red";
const NONE = "none";

const CARDS_WITH_COLORS_SINGLE = [0];
const CARDS_WITH_COLORS_MULTIPLE = [1, 2, 3, 4, 5, 6, 7, 8, 9, DRAW_TWO, REVERSE, SKIP];
const OTHER_CARDS = [WILD_DRAW_FOUR, WILD];
const CARD_COLORS = { BLUE, GREEN, YELLOW, RED, NONE };

module.exports = { CARD_COLORS, CARDS_WITH_COLORS_SINGLE, CARDS_WITH_COLORS_MULTIPLE, OTHER_CARDS };