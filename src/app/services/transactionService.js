import { Op, Sequelize } from 'sequelize';
import moment from 'moment';
import db from '../models';

class TransactionService {
  static async getAllTransactionByAccountId(accountId, page, limit) {
    try {
      const counter = await db.sequelize.query(
        `
      SELECT
        COUNT(a.*)
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
      const { count } = counter[0][0];
      const totalPages = Math.ceil(count / limit);
      page = page > totalPages ? totalPages : page;
      let limitFilter = limit || 50;
      let offset = page ? (page - 1) * limitFilter : 0;

      const transactions = await db.sequelize.query(
        `
      SELECT
        a.*,
        d.name AS "account_name",
        e.name AS "receiver_account_name",
        f.transaction_description AS "transaction_description"
      FROM transactions AS a
        INNER JOIN accounts AS b ON a.account_id = b.id
        LEFT JOIN accounts AS c ON a.transfer_account_id = c.id
        INNER JOIN users AS d ON b.user_id = d.id
        LEFT JOIN users AS e ON c.user_id = e.id
        INNER JOIN transactions_types AS f ON a.transaction_type = f.id
        WHERE a.account_id = :accountId OR a.transfer_account_id = :accountId
        ORDER BY 1
        LIMIT :limitFilter OFFSET :offset
      `,
        {
          replacements: { accountId, limitFilter, offset }
        }
      );

      if (transactions[0].length > 0) {
        const data = {
          count,
          rows: transactions[0]
        };
        return data;
      }

      console.log('This account does not have transactions.');
      return null;
    } catch (e) {
      console.log(e);
      throw new Error('Error during get all transaction by account id.');
    }
  }

  static async getTransactionsPerDate(accountId, initialDate, finalDate, page, limit) {
    try {
      initialDate = moment(initialDate)
        .utc()
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString();
      finalDate = moment(finalDate)
        .utc()
        .hour(23)
        .minute(59)
        .second(59)
        .millisecond(999)
        .toISOString();
      let limitFilter = limit || 50;
      let offset = page ? (page - 1) * limitFilter : 0;
      const transactions = await db.transactions.findAndCountAll({
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
            { [Op.or]: [{ account_id: accountId }, { transfer_account_id: accountId }] },
            {
              created_at: {
                [Op.between]: [initialDate, finalDate]
              }
            }
          ]
        },
        order: ['id'],
        limit: limitFilter,
        offset
      });
      if (transactions) {
        return transactions;
      }

      console.log('This account does not have transactions at this period.');
      return null;
    } catch (e) {
      console.log(e);
      throw new Error('Error during get transactions per date.');
    }
  }

  static async getTransactionsValuesLast5Months(accountId, initialDate, finalDate) {
    try {
      initialDate = moment(initialDate)
        .utc()
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString();
      finalDate = moment(finalDate)
        .utc()
        .hour(23)
        .minute(59)
        .second(59)
        .millisecond(999)
        .toISOString();
      // const transactions = await db.sequelize.query(
      //   `SELECT TO_CHAR(created_at, 'YYYY-MM') AS date_created,
      //     SUM(CASE WHEN transaction_type = 2 OR (transaction_type = 3 AND account_id = 1)
      //         THEN transaction_value * -1
      //         ELSE transaction_value END) as value
      //     FROM transactions
      //     WHERE (account_id = :accountId OR transfer_account_id = :accountId)
      //       AND (created_at BETWEEN :initialDate AND :finalDate)
      //     GROUP BY (date_created)`,
      //   { replacements: accountId, initialDate, finalDate }
      // );

      const transactions = await db.sequelize.query(
        `WITH months AS (
          SELECT generate_series(
            date_trunc('month', :finalDate::date) - '4 month'::interval,
            date_trunc('month', :finalDate::date),
            '1 month'::interval
          ) AS dates
        ), transactions_filter AS (
          SELECT date_part('month', created_at) AS created,
            SUM(CASE WHEN transaction_type = 2
              OR (transaction_type = 3 AND account_id = :accountId)
                THEN transaction_value * -1
                ELSE transaction_value END) AS value FROM transactions
                WHERE (account_id = :accountId OR transfer_account_id = :accountId)
                  AND (created_at BETWEEN :initialDate AND :finalDate)
                 GROUP BY created_at
        )
        SELECT to_char(date_trunc('month', a.dates), 'YYYY Month') as dates, COALESCE(SUM(b.value), 0) AS values
          FROM months AS a
          LEFT JOIN transactions_filter AS b
            ON date_part('month', a.dates) = b.created
            GROUP BY date_trunc('month', a.dates)
            ORDER BY date_trunc('month', a.dates)`,
        { replacements: { accountId, initialDate, finalDate } }
      );
      if (transactions[0].length > 0) {
        return transactions[0];
      }

      console.log('This account does not have transactions.');
      return null;
    } catch (e) {
      console.log(e);
      throw new Error('Error during get transactions values last 5 months.');
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
