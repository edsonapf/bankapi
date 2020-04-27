import { Sequelize } from 'sequelize';
import db from '../models';

class AccountService {
  static async createAccount(userId, main) {
    try {
      const accountDetails = {
        userId: userId,
        balance: 0,
        mainAccount: main
      };
      return await db.Accounts.create(accountDetails);
    } catch (err) {
      throw new Error('Error during create an account!');
    }
  }

  static async getAccountsByUserId(userId) {
    try {
      const accounts = await db.Accounts.findAll({
        where: {
          userId: userId
        }
      });
      if (accounts) {
        return accounts;
      }

      console.log('This userId does not have account!');
      return null;
    } catch (err) {
      throw new Error('Error during get accounts by userid!');
    }
  }

  static async changeMainAccount(accountId) {
    let transaction;
    try {
      transaction = await Sequelize.transaction();
      const account = await db.Accounts.update(
        {
          mainAccount: true
        },
        {
          where: {
            id: accountId
          }
        },
        {
          transaction
        }
      );
      const accounts = await db.Accounts.update(
        {
          mainAccount: false
        },
        {
          where: {
            userId: account.userId
          }
        },
        {
          transaction
        }
      );
      await transaction.commit();
      return account;
    } catch (e) {
      if (transaction) {
        await transaction.rollback();
      }
      throw new Error('Error during change main account.');
    }
  }

  static async deleteAccount(accountId) {
    try {
      const account = await db.Accounts.findOne({
        where: {
          id: accountId
        }
      });
      if (account) {
        return await db.Accounts.destroy({
          where: {
            id: accountId
          }
        });
      }

      console.log('Account does not exist.');
      return null;
    } catch (e) {
      throw new Error('Error during account delete.');
    }
  }
}

export default AccountService;
