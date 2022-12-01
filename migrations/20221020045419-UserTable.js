'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      user_id: {
        type: Sequelize.INTEGER,
        chrprimaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(45),
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};