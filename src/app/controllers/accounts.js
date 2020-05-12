import { validationResult } from 'express-validator';
import AccountService from '../services/accountService';

const createAccount = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { userId, main } = req.body;
    const account = await AccountService.createAccount(userId, main);
    return res.status(200).send(account);
  } catch (e) {
    return res.status(500).json({ error: 'Something wrong when tried to create an account.' });
  }
};

const getAccountsByUserId = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { userId } = req.params;
    const accounts = await AccountService.getAccountsByUserId(userId);
    if (accounts) {
      return res.status(200).send(accounts);
    }

    return res.status(404).json({ error: 'User does not have accounts.' });
  } catch (e) {
    return res
      .status(500)
      .json({ error: 'Something wrong when tried to list all accounts by userid.' });
  }
};

const changeMainAccount = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { accountId } = req.params;
    const account = await AccountService.changeMainAccount(accountId);
    if (account) {
      return res.status(200).send(account);
    }

    return res.status(404).json({ error: 'Account does not exist.' });
  } catch (e) {
    return res.status(500).json({ error: 'Something wrong when tried to change main account.' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { accountId } = req.params;
    const accountDeleted = await AccountService.deleteAccount(accountId);
    if (accountDeleted) {
      return res.status(200).send('Account has been deleted.');
    }

    return res.status(404).json({ error: 'Account does not exist.' });
  } catch (e) {
    return res.status(500).json({ error: 'Something wrong when tried to delete the account.' });
  }
};

export { createAccount, getAccountsByUserId, changeMainAccount, deleteAccount };
