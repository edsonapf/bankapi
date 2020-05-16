'use strict';
module.exports = (sequelize, DataTypes) => {
  const transactions = sequelize.define(
    'transactions',
    {
      account_id: DataTypes.INTEGER,
      transaction_type: DataTypes.INTEGER,
      transaction_value: DataTypes.DOUBLE,
      transfer_account_id: DataTypes.INTEGER
    },
    {}
  );
  transactions.associate = function(models) {
    // associations can be defined here
    transactions.belongsTo(models.accounts, { foreignKey: 'account_id' });
    transactions.belongsTo(models.transactions_types, { foreignKey: 'transaction_type' });
  };
  return transactions;
};
