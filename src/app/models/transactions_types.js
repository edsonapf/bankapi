'use strict';
module.exports = (sequelize, DataTypes) => {
  const transactions_types = sequelize.define(
    'transactions_types',
    {
      transaction_description: DataTypes.STRING
    },
    {}
  );
  transactions_types.associate = function(models) {
    // associations can be defined here
    transactions_types.hasMany(models.transactions);
  };
  return transactions_types;
};
