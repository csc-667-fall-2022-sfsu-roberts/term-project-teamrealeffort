'use strict';
module.exports = {
 
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Card',
      {
         CardId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,  
          allowNull: false
        }, 
        Color: {
          type: Sequelize.STRING(100),  
          allowNull: false
        }, 
        Value: { 
          type: Sequelize.STRING(100), 
          allowNull: false
        }

      }
    );
  }, 
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Card');
  }
};