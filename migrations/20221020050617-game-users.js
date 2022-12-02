'use strict';
module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_users', {
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      seat: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      current: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('game_users');
  }
};