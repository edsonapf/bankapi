import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../../config/env';
import db from '../models';

class UserService {
  static async createUser(user) {
    try {
      bcrypt.hash(user.password, parseInt(SALT_ROUNDS), (err, hash) => {
        if (err) {
          throw new Error('Error during hash password!');
        } else {
          user.password = hash;
          return db.Users.create(user);
        }
      });
    } catch (err) {
      throw new Error('Error during user insert!');
    }
  }

  static async getAllUsers() {
    try {
      const result = await db.Users.findAll({
        attributes: [
          'id',
          'cpf',
          'email',
          'name',
          'address',
          'houseNumber',
          'state',
          'country',
          'zipcode',
          'birthday',
          'profilePhoto',
          'createdAt'
        ]
      });
      return result;
    } catch (e) {
      throw new Error('Error during find all users!');
    }
  }

  static async getUserById(userId) {
    try {
      const result = await db.Users.findOne({
        attributes: [
          'id',
          'cpf',
          'email',
          'name',
          'address',
          'houseNumber',
          'state',
          'country',
          'zipcode',
          'birthday',
          'profilePhoto',
          'createdAt'
        ],
        where: {
          id: userId
        }
      });

      return result;
    } catch (err) {
      throw new Error('Error during find user by id!');
    }
  }

  static async getUserByCpf(cpf) {
    try {
      const result = await db.Users.findOne({
        attributes: [
          'id',
          'cpf',
          'email',
          'name',
          'address',
          'houseNumber',
          'state',
          'country',
          'zipcode',
          'birthday',
          'profilePhoto',
          'createdAt'
        ],
        where: {
          cpf: cpf
        }
      });

      return result;
    } catch (err) {
      throw new Error('Error during find user by cpf!');
    }
  }

  static async updateUser(userId, updateUser) {
    try {
      const user = await this.getUserById(userId);
      if (user) {
        return await update(updateUser, {
          where: {
            id: userId
          }
        });
      }

      console.log('We can not update this user beacuse this user does not exist!');
      return null;
    } catch (err) {
      throw new Error('Error during user update!');
    }
  }

  static async deleteUser(userId) {
    try {
      const user = await db.Users.findOne({
        where: {
          userId: userId
        }
      });

      if (user) {
        return await db.Users.destroy({
          where: {
            id: userId
          }
        });
      }

      console.log('This user does not exist!');
      return null;
    } catch (err) {
      throw new Error('Error during user delete!');
    }
  }
}

export default UserService;
