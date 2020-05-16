import { Op } from 'sequelize';
import db from '../models';

class AccountService {
  static async createAccount(userId, main) {
    try {
      const accountDetails = {
        user_id: userId,
        balance: 0,
        main_account: main
      };
      return await db.accounts.create(accountDetails);
    } catch (err) {
      throw new Error('Error during create an account!');
    }
  }

  static async getAccountsByUserId(userId) {
    try {
      const accounts = await db.accounts.findAll({
        attributes: ['id', 'user_id', 'balance', 'main_account', 'created_at', 'updated_at'],
        where: {
          user_id: userId
        },
        order: ['id']
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
      const account = await db.accounts.findOne({
        attributes: ['id', 'user_id', 'balance', 'main_account', 'created_at', 'updated_at'],
        include: {
          model: db.users,
          attributes: ['cpf'],
          required: true
        },
        where: {
          id: accountId
        },
        order: ['id']
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

  static async changeMainAccount(userId, accountId) {
    let transaction;
    try {
      transaction = await db.sequelize.transaction();
      const account = await db.accounts.update(
        {
          main_account: true
        },
        {
          where: {
            id: accountId
          },
          transaction
        }
      );
      const accounts = await db.accounts.update(
        {
          main_account: false
        },
        {
          where: {
            [Op.and]: [{ user_id: userId }, { id: { [Op.ne]: accountId } }]
          },
          transaction
        }
      );
      await transaction.commit();
      return account;
    } catch (e) {
      console.log(e);
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
        const updatedAccount = await db.accounts.update(
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
        return await db.accounts.destroy({
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
