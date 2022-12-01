'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Game_has_Cards',
      {
        User_UserId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        Game_GameId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        Card_CardId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        Discarded: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        In_Deck: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        Order: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Game');
  }
};