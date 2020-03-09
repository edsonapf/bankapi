'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionsTypes = sequelize.define(
    'TransactionsTypes',
    {
      transactionDescription: DataTypes.STRING(100)
    },
    {}
  );
  TransactionsTypes.associate = function(models) {
    // associations can be defined here
  };
  return TransactionsTypes;
};
