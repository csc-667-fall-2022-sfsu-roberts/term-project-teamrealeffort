'use strict';
module.exports = {
 
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Game',
      {
        GameId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,  
          allowNull: false
        }
      }
    );
  }, 
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Game');
  }
};