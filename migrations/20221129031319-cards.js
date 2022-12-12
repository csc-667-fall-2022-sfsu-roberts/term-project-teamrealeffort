"use strict";
const cards = require("../config/cards");
const {
  CARD_COLORS,
  NO_COLOR_CARD_TYPES,
  DUAL_COLOR_CARD_TYPES,
  SINGLE_COLOR_CARD_TYPES,
} = cards;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cards", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    const SINGLE_CARDS = SINGLE_COLOR_CARD_TYPES.reduce((memo, type) => {
      Object.values(CARD_COLORS)
        .filter((color) => color !== CARD_COLORS.NONE)
        .forEach((color) => {
          memo.push({ color, type });
        });

      return memo;
    }, []);

    const DUAL_CARDS = DUAL_COLOR_CARD_TYPES.reduce((memo, type) => {
      Object.values(CARD_COLORS)
        .filter((color) => color !== CARD_COLORS.NONE)
        .forEach((color) => {
          memo.push({ color, type });
          memo.push({ color, type });
        });

      return memo;
    }, []);

    const WILD_CARDS = NO_COLOR_CARD_TYPES.reduce((memo, type) => {
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
  },
};
