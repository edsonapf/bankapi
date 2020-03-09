'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define(
    'Transactions',
    {
      accountId: DataTypes.INTEGER,
      transactionType: DataTypes.INTEGER,
      transactionValue: DataTypes.DOUBLE,
      toAccountNumber: DataTypes.STRING(7)
    },
    {}
  );
  Transactions.associate = function(models) {
    // associations can be defined here
  };
  return Transactions;
};
