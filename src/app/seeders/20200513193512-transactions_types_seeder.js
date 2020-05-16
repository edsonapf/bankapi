'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'transactions_types',
      [
        {
          transaction_description: 'Deposit',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          transaction_description: 'Withdraw',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          transaction_description: 'Transfer',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('transactions_types', null, {});
  }
};
