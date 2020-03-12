import { Op } from 'sequelize';
import db from '../models';

class UserService {
  static async createUser(user) {
    try {
      return await db.Users.create(user);
    } catch (err) {
      throw new Error('Error during user insert!');
    }
  }

  static async getUserById(userId) {
    try {
      const result = await db.Users.findOne({
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
      const user = await db.Users.findOne({
        where: {
          userId: userId
        }
      });

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
