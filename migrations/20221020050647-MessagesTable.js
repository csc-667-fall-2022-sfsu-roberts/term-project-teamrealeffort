'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'messages',
      {
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        game_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        }
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('messages');
  }
};