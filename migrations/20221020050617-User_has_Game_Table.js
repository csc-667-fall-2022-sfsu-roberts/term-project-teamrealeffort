'use strict';
module.exports = {
 
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'User_has_Game',
      {
          User_UserId: {
          type: Sequelize.INTEGER, 
          allowNull: false
        }, 
        Game_GameId: { 
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
    return queryInterface.dropTable('User_has_Game');
  }
};