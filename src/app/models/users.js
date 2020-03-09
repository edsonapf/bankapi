'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      cpf: DataTypes.STRING(11),
      email: DataTypes.STRING(100),
      name: DataTypes.STRING(255),
      password: DataTypes.STRING(255),
      adress: DataTypes.STRING(100),
      zipcode: DataTypes.STRING(8),
      birthday: DataTypes.DATE
    },
    {}
  );
  Users.associate = function(models) {
    // associations can be defined here
    Users.hasMany(models.Accounts);
  };
  return Users;
};
