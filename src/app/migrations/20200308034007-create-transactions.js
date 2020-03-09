'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Transactions', {
      transactionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountId: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Accounts',
          key: 'accountId'
        }
      },
      transactionType: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      transactionValue: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      toAccountNumber: {
        allowNull: true,
        type: Sequelize.STRING(7)
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
    return queryInterface.dropTable('Transactions');
  }
};
