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

    const { account_id } = req.params;
    const result = await TransactionService.getAllTransactionByAccountId(account_id);
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

    const { account_id } = req.params;
    const { initial_date, final_date } = req.query;
    const result = await TransactionService.getTransactionsPerDate(
      account_id,
      initial_date,
      final_date
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
  let sqlTransaction;
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { account_id, value } = req.body;
    const transactionType = 1;
    sqlTransaction = await db.sequelize.transaction();
    const senderAccount = await AccountService.getAccountByAccountId(account_id);
    if (!senderAccount) {
      console.log('Account does not exist.');
      return res.status(404).json({ error: 'Account does not exist.' });
    }

    const transaction = await TransactionService.createTransaction(
      account_id,
      transactionType,
      value,
      null,
      sqlTransaction
    );
    await AccountService.updateBalance(account_id, value, sqlTransaction);
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
  let sqlTransaction;
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { account_id, value } = req.body;
    const transactionType = 2;
    sqlTransaction = await db.sequelize.transaction();
    const senderAccount = await AccountService.getAccountByAccountId(account_id);
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
      account_id,
      transactionType,
      value,
      null,
      sqlTransaction
    );
    await AccountService.updateBalance(account_id, value * -1, sqlTransaction);
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
  let sqlTransaction;
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { sender_account_id, value, receiver_account_id, cpf } = req.body;
    const transactionType = 3;
    sqlTransaction = await db.sequelize.transaction();
    const senderAccount = await AccountService.getAccountByAccountId(sender_account_id);
    const receiverAccount = await AccountService.getAccountByAccountId(receiver_account_id);
    if (!senderAccount) {
      if (sqlTransaction !== undefined) sqlTransaction.rollback();
      console.log('Account does not exist.');
      return res.status(404).json({ error: 'Account does not exist.' });
    }
    if (!receiverAccount || receiverAccount.user.cpf !== cpf) {
      if (sqlTransaction !== undefined) sqlTransaction.rollback();
      console.log('Account you are trying to transfer does not exist.');
      return res
        .status(404)
        .json({ error: 'Account you are trying to transfer does not exist or this cpf is wrong.' });
    }
    if (senderAccount.balance - value < 0) {
      if (sqlTransaction !== undefined) sqlTransaction.rollback();
      console.log('Account does not have balance to transfer money.');
      return res.status(404).json({ error: 'Account does not have balance to transfer money.' });
    }

    const transaction = await TransactionService.createTransaction(
      sender_account_id,
      transactionType,
      value,
      receiver_account_id,
      sqlTransaction
    );
    // Multiply the value per -1 to subtract the value
    await AccountService.updateBalance(sender_account_id, value * -1, sqlTransaction);
    await AccountService.updateBalance(receiver_account_id, value, sqlTransaction);
    await sqlTransaction.commit();

    return res.status(200).send(transaction);
  } catch (e) {
    console.log(e);
    if (sqlTransaction !== undefined) {
      await sqlTransaction.rollback();
    }

    return res.status(500).json({ error: 'Something wrong when tried to create a transaction.' });
  }
};

// Finish the implementation
const getUsersNamesFavoritesTransfer = async (req, res) => {
  try {
    const { account_id } = req.params;
    const result = await TransactionService.getUsersNamesFavoritesTransfer(account_id);
    if (result) {
      return res.status(200).send(result);
    }

    return res.status(404).json({ error: 'This account does not have favorite accounts' });
  } catch (e) {
    return res
      .status(500)
      .json({ error: 'Something wrong when tried to get favorites users names to transfer.' });
  }
};

const getAccountsFavoritesTransfer = async (req, res) => {
  try {
    const { account_id, user_id } = req.params;
    const result = await TransactionService.getAccountsFavoritesTransfer(account_id, user_id);
    if (result) {
      return res.status(200).send(result);
    }

    return res.status(404).json({ error: 'This account does not have favorite accounts' });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: 'Something wrong when tried to get favorites accounts to transfer.' });
  }
};

export {
  getAllTransactionByAccountId,
  getTransactionsPerDate,
  deposit,
  withdraw,
  transfer,
  getUsersNamesFavoritesTransfer,
  getAccountsFavoritesTransfer
};
