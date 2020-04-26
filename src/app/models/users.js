'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      cpf: DataTypes.STRING,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      houseNumber: DataTypes.INTEGER,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      zipcode: DataTypes.STRING,
      birthday: DataTypes.DATE,
      profilePhoto: DataTypes.STRING
    },
    {}
  );
  Users.associate = function(models) {
    // associations can be defined here
    Users.hasMany(models.Accounts);
  };
  return Users;
};
