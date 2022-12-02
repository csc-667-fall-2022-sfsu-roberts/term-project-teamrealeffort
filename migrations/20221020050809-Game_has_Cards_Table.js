'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_cards', {
      game_id: { type: Sequelize.INTEGER, allowNull: false },
      card_id: { type: Sequelize.INTEGER, allowNull: false },
      user_id: { type: Sequelize.INTEGER, allowNull: false, defaultvalue: 0 },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("game_cards");
  }
};