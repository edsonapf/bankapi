import { validationResult } from 'express-validator';
import db from '../models';
import TransactionService from '../services/transactionService';
import AccountService from '../services/accountService';

const getAllTransactionByAccountId = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { accountId } = req.params;
    const result = await TransactionService.getAllTransactionByAccountId(accountId);
    if (result) {
      return res.status(200).send(result);
    }

    return res.status(404).json({ error: 'This account does not have transaction' });
  } catch (e) {
    return res
      .status(500)
      .json({ error: 'Something wrong when tried to find all transactions by account id.' });
  }
};

const getTransactionsPerDate = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { accountId } = req.params;
    const { initialDate, finalDate } = req.query;
    const result = await TransactionService.getTransactionsPerDate(
      accountId,
      initialDate,
      finalDate
    );
    if (result) {
      return res.status(200).send(result);
    }

    return res.status(404).json({ error: 'This account does not have transaction' });
  } catch (e) {
    return res
      .status(500)
      .json({ error: 'Something wrong when tried to find all transactions per date.' });
  }
};

const deposit = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { accountId, value } = req.body;
    const transactionType = 1;
    const sqlTransaction = await db.sequelize.transaction();
    const senderAccount = await AccountService.getAccountByAccountId(accountId);
    if (!senderAccount) {
      console.log('Account does not exist.');
      return res.status(404).json({ error: 'Account does not exist.' });
    }

    const transaction = await TransactionService.createTransaction(
      accountId,
      transactionType,
      value,
      null,
      sqlTransaction
    );
    await AccountService.updateBalance(accountId, value, sqlTransaction);
    await sqlTransaction.commit();

    return res.status(200).send(transaction);
  } catch (e) {
    if (sqlTransaction !== undefined) {
      await sqlTransaction.rollback();
    }

    return res.status(500).json({ error: 'Something wrong when tried to create a deposit.' });
  }
};

const withdraw = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { accountId, value } = req.body;
    const transactionType = 2;
    const sqlTransaction = await db.sequelize.transaction();
    const senderAccount = await AccountService.getAccountByAccountId(accountId);
    if (!senderAccount) {
      if (sqlTransaction !== undefined) sqlTransaction.rollback();
      console.log('Account does not exist.');
      return res.status(404).json({ error: 'Account does not exist.' });
    }
    // Search which response code put here
    if (senderAccount.balance - value < 0) {
      if (sqlTransaction !== undefined) sqlTransaction.rollback();
      console.log('Account does not have balance to withdraw this value.');
      return res
        .status(404)
        .json({ error: 'Account does not have balance to withdraw this value.' });
    }

    const transaction = await TransactionService.createTransaction(
      accountId,
      transactionType,
      value,
      null,
      sqlTransaction
    );
    await AccountService.updateBalance(accountId, value * -1, sqlTransaction);
    await sqlTransaction.commit();

    return res.status(200).send(transaction);
  } catch (e) {
    if (sqlTransaction !== undefined) {
      await sqlTransaction.rollback();
    }

    return res.status(500).json({ error: 'Something wrong when tried to create a deposit.' });
  }
};

const transfer = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { senderAccountId, value, receiverAccountId } = req.body;
    const transactionType = 3;
    const sqlTransaction = await db.sequelize.transaction();
    const senderAccount = await AccountService.getAccountByAccountId(senderAccountId);
    const receiverAccount = await AccountService.getAccountByAccountId(receiverAccountId);
    if (!senderAccount || !receiverAccount) {
      if (sqlTransaction !== undefined) sqlTransaction.rollback();
      console.log('Account does not exist.');
      return res.status(404).json({ error: 'Account does not exist.' });
    }
    if (senderAccount.balance - value < 0) {
      if (sqlTransaction !== undefined) sqlTransaction.rollback();
      console.log('Account does not have balance to transfer money.');
      return res.status(404).json({ error: 'Account does not have balance to transfer money.' });
    }

    const transaction = await TransactionService.createTransaction(
      senderAccountId,
      transactionType,
      value,
      receiverAccountId,
      sqlTransaction
    );
    // Multiply the value per -1 to subtract the value
    await AccountService.updateBalance(senderAccountId, value * -1, sqlTransaction);
    await AccountService.updateBalance(receiverAccountId, value, sqlTransaction);
    await sqlTransaction.commit();

    return res.status(200).send(transaction);
  } catch (e) {
    if (sqlTransaction !== undefined) {
      await sqlTransaction.rollback();
    }

    return res.status(500).json({ error: 'Something wrong when tried to create a transaction.' });
  }
};

export { getAllTransactionByAccountId, getTransactionsPerDate, deposit, withdraw, transfer };
