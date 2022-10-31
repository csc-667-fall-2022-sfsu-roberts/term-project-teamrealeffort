'use strict';
module.exports = {
 
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Messages',
      {
          User_UserId: {
          type: Sequelize.INTEGER,
          allowNull: false
        }, 
          Game_GameId: { 
          type: Sequelize.INTEGER, 
          allowNull: false
        }, 
          Content: { 
          type: Sequelize.TEXT, 
          allowNull: false
        }
      }
    );
  }, 
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Messages');
  }
};