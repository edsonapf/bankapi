'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      cpf: DataTypes.STRING,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      house_number: DataTypes.INTEGER,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      zipcode: DataTypes.STRING,
      birthday: DataTypes.DATE,
      profile_photo: DataTypes.STRING
    },
    {}
  );
  users.associate = function(models) {
    // associations can be defined here
    users.hasMany(models.accounts);
  };
  return users;
};
