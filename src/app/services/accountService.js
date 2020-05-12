import { Op } from 'sequelize';
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
        attributes: ['id', 'userId', 'balance', 'mainAccount', 'createdAt', 'updatedAt'],
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
      console.log(err);
      throw new Error('Error during get accounts by userid!');
    }
  }

  static async getAccountByAccountId(accountId) {
    try {
      const account = await db.Accounts.findOne({
        attributes: ['id', 'userId', 'balance', 'mainAccount', 'createdAt', 'updatedAt'],
        where: {
          id: accountId
        }
      });
      if (account) {
        return account;
      }

      console.log('Account with this id not found.');
      return null;
    } catch (e) {
      throw new Error('Error during find account by account id');
    }
  }

  static async changeMainAccount(accountId) {
    let transaction;
    try {
      transaction = await db.sequelize.transaction();
      const account = await db.Accounts.update(
        {
          mainAccount: true
        },
        {
          where: {
            id: accountId
          },
          transaction
        }
      );
      const accounts = await db.Accounts.update(
        {
          mainAccount: false
        },
        {
          where: {
            [Op.and]: [{ userId: account.userId }, { [Op.ne]: accountId }]
          },
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

  static async updateBalance(accountId, value) {
    try {
      const account = await this.getAccountByAccountId(accountId);
      if (account) {
        let balance = account.balance + value;
        const updatedAccount = await db.Accounts.update(
          {
            balance: balance.toFixed(2)
          },
          {
            where: {
              id: accountId
            }
          }
        );
        console.log('Updated Account', updatedAccount);
        return updatedAccount;
      }

      return null;
    } catch (e) {
      throw new Error('Error during update balance');
    }
  }

  static async deleteAccount(accountId) {
    try {
      const account = await this.getAccountByAccountId(accountId);
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
