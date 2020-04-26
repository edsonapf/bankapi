import { Op } from 'sequelize';
import UserService from './userService';
import db from '../models';

class AccountService {
  static async createAccount(userId) {
    try {
    } catch (err) {
      throw new Error('Error during create an account!');
    }
  }
}

export default AccountService;
