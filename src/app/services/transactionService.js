import { Op } from 'sequelize';
import db from '../models';

class TransactionService {
  static async getAllTransactionByAccountId(accountId) {
    try {
      const transactions = await db.Transactions.findAll({
        attributes: [
          'id',
          'accountId',
          'transactionType',
          'transactionValue',
          'transferAccountId',
          'createdAt'
        ],
        where: {
          accountId
        }
      });
      if (transactions) {
        return transactions;
      }

      console.log('This account does not have transactions.');
      return null;
    } catch (e) {
      throw new Error('Error during get all transaction by account id.');
    }
  }

  static async getTransactionsPerDate(accountId, initialDate, finalDate) {
    try {
      initialDate = new Date(initialDate).setUTCHours(0, 0, 0, 0);
      finalDate = new Date(finalDate).setUTCHours(23, 59, 59, 999);
      const transactions = await db.Transactions.findAll({
        attributes: [
          'id',
          'accountId',
          'transactionType',
          'transactionValue',
          'transferAccountId',
          'createdAt'
        ],
        where: {
          [Op.and]: [
            { accountId },
            {
              createdAt: {
                [Op.between]: [initialDate, finalDate]
              }
            }
          ]
        }
      });
      if (transactions) {
        return transactions;
      }

      console.log('This account does not have transactions at this period.');
      return null;
    } catch (e) {
      throw new Error('Error during get transactions per date.');
    }
  }

  /**
   * Transactions Type:
   *  1 - Deposit
   *  2 - Withdraw
   *  3 - Transfer
   * @param {*} senderAccountId
   * @param {*} receiverAccountId
   * @param {*} value
   */
  static async createTransaction(
    senderAccountId,
    transactionType,
    value,
    receiverAccountId,
    sqlTransaction
  ) {
    try {
      const payload = {
        accountId: senderAccountId,
        transactionType: transactionType,
        transactionValue: value,
        transferAccountId: receiverAccountId
      };

      const transaction = await db.Transactions.create(payload, { transaction: sqlTransaction });
      return transaction;
    } catch (e) {
      throw new Error('Error during create a transaction.');
    }
  }
}

export default TransactionService;
