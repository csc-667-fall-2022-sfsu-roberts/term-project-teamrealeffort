'use strict';

const cards = require("../config/cards");

const {
  CARD_COLORS,
  CARDS_WITH_COLORS_SINGLE,
  CARDS_WITH_COLORS_MULTIPLE,
  OTHER_CARDS } = cards;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cards", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    });

    const SINGLE_CARDS = CARDS_WITH_COLORS_SINGLE.reduce((memo, type) => {
      Object.values(CARD_COLORS)
        .filter((color) => color !== CARD_COLORS.NONE)
        .forEach(color => {
          memo.push({ color, type });
        });

      return memo;
    }, []);

    const DUAL_CARDS = CARDS_WITH_COLORS_MULTIPLE.reduce((memo, type) => {
      Object.values(CARD_COLORS)
        .filter((color) => color !== CARD_COLORS.NONE)
        .forEach(color => {
          memo.push({ color, type });
          memo.push({ color, type });
        });

      return memo;
    }, []);

    const WILD_CARDS = OTHER_CARDS.reduce((memo, type) => {
      memo.push({ color: CARD_COLORS.NONE, type });
      memo.push({ color: CARD_COLORS.NONE, type });
      memo.push({ color: CARD_COLORS.NONE, type });
      memo.push({ color: CARD_COLORS.NONE, type });

      return memo;
    }, []);

    await queryInterface.bulkInsert("cards", [
      ...SINGLE_CARDS,
      ...DUAL_CARDS,
      ...WILD_CARDS,
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("cards");
  }
};