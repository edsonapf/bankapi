'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cpf: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(11)
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(100)
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      houseNumber: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING
      },
      country: {
        allowNull: false,
        type: Sequelize.STRING
      },
      zipcode: {
        allowNull: false,
        type: Sequelize.STRING(8)
      },
      birthday: {
        allowNull: false,
        type: Sequelize.DATE
      },
      profilePhoto: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
