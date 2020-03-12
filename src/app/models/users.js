'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    cpf: {
      type: DataTypes.STRING(11),
      validate: {
        isNumeric: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      validate: {
        isEmail: true
      }
    },
    name: DataTypes.STRING(255),
    password: DataTypes.STRING(255),
    adress: DataTypes.STRING(100),
    zipcode: DataTypes.STRING(8),
    birthday: DataTypes.DATE
  });
  Users.associate = function(models) {
    // associations can be defined here
    Users.hasMany(models.Accounts);
  };
  return Users;
};
