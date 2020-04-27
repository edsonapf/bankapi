'use strict';
module.exports = (sequelize, DataTypes) => {
  const Accounts = sequelize.define(
    'Accounts',
    {
      userId: DataTypes.INTEGER,
      balance: DataTypes.DOUBLE,
      mainAccount: DataTypes.BOOLEAN
    },
    {}
  );
  Accounts.associate = function(models) {
    // associations can be defined here
    Accounts.hasMany(models.Transactions);
  };
  return Accounts;
};
