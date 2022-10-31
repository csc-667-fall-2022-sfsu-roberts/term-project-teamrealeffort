'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'User',
      {
        UserId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true, 
          unique: true, 
          allowNull: false
        },
        UserName: {
          type: Sequelize.STRING(45),
          unique: true, 
          allowNull: false
         
        },
        Password: {
          type:Sequelize.STRING(45),
          allowNull: false
        },
        Email: { 
          type: Sequelize.STRING(100),
          unique: true, 
          allowNull: false

        }
      }
    );
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('User');
  }
};