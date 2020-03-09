'use strict';
module.exports = (sequelize, DataTypes) => {
  const Accounts = sequelize.define(
    'Accounts',
    {
      accountNumber: DataTypes.STRING(7),
      userId: DataTypes.INTEGER,
      balance: DataTypes.DOUBLE
    },
    {}
  );
  Accounts.associate = function(models) {
    // associations can be defined here
    Accounts.hasMany(models.Transactions);
  };
  return Accounts;
};
