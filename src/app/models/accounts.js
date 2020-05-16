'use strict';
module.exports = (sequelize, DataTypes) => {
  const accounts = sequelize.define(
    'accounts',
    {
      user_id: DataTypes.INTEGER,
      balance: DataTypes.DOUBLE,
      main_account: DataTypes.BOOLEAN
    },
    {}
  );
  accounts.associate = function(models) {
    // associations can be defined here
    accounts.belongsTo(models.users, { foreignKey: 'user_id' });
    accounts.hasMany(models.transactions);
  };
  return accounts;
};
