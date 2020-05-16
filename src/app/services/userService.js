import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../../config/env';
import db from '../models';

class UserService {
  static async createUser(user) {
    try {
      bcrypt.hash(user.password, parseInt(SALT_ROUNDS), async (err, hash) => {
        if (err) {
          throw new Error('Error during hash password!');
        } else {
          user.password = hash;
          return await db.users.create(user);
        }
      });
    } catch (err) {
      throw new Error('Error during user insert!');
    }
  }

  static async getAllUsers() {
    try {
      const result = await db.users.findAll({
        attributes: [
          'id',
          'cpf',
          'email',
          'name',
          'address',
          'house_number',
          'state',
          'country',
          'zipcode',
          'birthday',
          'profile_photo',
          'created_at'
        ],
        order: ['id']
      });
      return result;
    } catch (e) {
      throw new Error('Error during find all users!');
    }
  }

  static async getUserById(userId) {
    try {
      const result = await db.users.findOne({
        attributes: [
          'id',
          'cpf',
          'email',
          'name',
          'address',
          'house_number',
          'state',
          'country',
          'zipcode',
          'birthday',
          'profile_photo',
          'created_at'
        ],
        where: {
          id: userId
        },
        order: ['id']
      });

      return result;
    } catch (err) {
      throw new Error('Error during find user by id!');
    }
  }

  static async getUserByCpf(cpf) {
    try {
      const result = await db.users.findOne({
        attributes: [
          'id',
          'cpf',
          'email',
          'name',
          'password',
          'address',
          'house_number',
          'state',
          'country',
          'zipcode',
          'birthday',
          'profile_photo',
          'created_at'
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
        return await db.users.update(updateUser, {
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

  static async updateUserPhoto(userId, filePath) {
    try {
      const user = await this.getUserById(userId);
      if (user) {
        return await db.users.update(
          { profile_photo: filePath },
          {
            where: {
              id: userId
            }
          }
        );
      }

      console.log('We can not upload the user photo beacuse this user does not exist!');
      return null;
    } catch (err) {
      throw new Error('Error during upload user photo.');
    }
  }

  static async deleteUser(userId) {
    try {
      const user = await db.users.findOne({
        where: {
          id: userId
        }
      });

      if (user) {
        return await db.users.destroy({
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
