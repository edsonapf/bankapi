import { Op, Sequelize } from 'sequelize';
import db from '../models';

class TransactionService {
  static async getAllTransactionByAccountId(accountId) {
    try {
      const transactions = await db.sequelize.query(
        `
      SELECT
        a.*,
        d.name AS "account_name",
        e.name AS "receiver_account_name",
        f.transaction_description AS "Transaction"
      FROM transactions AS a
        INNER JOIN accounts AS b ON a.account_id = b.id
        LEFT JOIN accounts AS c ON a.transfer_account_id = c.id
        INNER JOIN users AS d ON b.user_id = d.id
        LEFT JOIN users AS e ON c.user_id = e.id
        INNER JOIN transactions_types AS f ON a.transaction_type = f.id
        WHERE a.account_id = :accountId OR a.transfer_account_id = :accountId
        ORDER BY 1
      `,
        {
          replacements: { accountId }
        }
      );

      if (transactions[0].length > 0) {
        return transactions[0];
      }

      console.log('This account does not have transactions.');
      return null;
    } catch (e) {
      console.log(e);
      throw new Error('Error during get all transaction by account id.');
    }
  }

  static async getTransactionsPerDate(accountId, initialDate, finalDate) {
    try {
      initialDate = new Date(initialDate).setUTCHours(0, 0, 0, 0);
      finalDate = new Date(finalDate).setUTCHours(23, 59, 59, 999);
      const transactions = await db.transactions.findAll({
        attributes: [
          'id',
          'account_id',
          'transaction_type',
          'transaction_value',
          'transfer_account_id',
          'created_at'
        ],
        where: {
          [Op.and]: [
            { account_id: accountId },
            {
              created_at: {
                [Op.between]: [initialDate, finalDate]
              }
            }
          ]
        },
        order: ['id']
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

  static async getAccountsFavoritesTransfer(accountId, userId) {
    try {
      const transactions = await db.sequelize.query(
        `
        SELECT DISTINCT ON (a.transfer_account_id)
          a.transfer_account_id
        FROM transactions AS a
          INNER JOIN accounts AS b ON a.transfer_account_id = b.id
          INNER JOIN users AS c ON b.user_id = c.id
          WHERE a.transaction_type = 3
            AND a.account_id = :accountId
            AND c.id = :userId
      `,
        {
          replacements: { accountId, userId }
        }
      );
      if (transactions[0].length > 0) {
        return transactions[0];
      }

      return null;
    } catch (err) {
      console.error(err);
      throw new Error('Error during get favorites users.');
    }
  }

  static async getUsersNamesFavoritesTransfer(accountId) {
    try {
      const transactions = await db.sequelize.query(
        `
        SELECT DISTINCT ON (user_id)
          c.id AS user_id,
          c.name,
          c.cpf
        FROM transactions AS a
          INNER JOIN accounts AS b ON a.transfer_account_id = b.id
          INNER JOIN users AS c ON b.user_id = c.id
          WHERE transaction_type = 3 and account_id = :accountId
      `,
        {
          replacements: { accountId }
        }
      );
      if (transactions[0].length > 0) {
        console.log(transactions[0]);
        return transactions[0];
      }

      return null;
    } catch (err) {
      console.error(err);
      throw new Error('Error during get favorites users.');
    }
  }

  static async createTransaction(
    senderAccountId,
    transactionType,
    value,
    receiverAccountId,
    sqlTransaction
  ) {
    try {
      const payload = {
        account_id: senderAccountId,
        transaction_type: transactionType,
        transaction_value: value,
        transfer_account_id: receiverAccountId
      };

      const transaction = await db.transactions.create(payload, { transaction: sqlTransaction });
      return transaction;
    } catch (e) {
      throw new Error('Error during create a transaction.');
    }
  }
}

export default TransactionService;
