import { check } from 'express-validator';
import { inputErrors } from '../errors/transactionErrors';

const validation = method => {
  switch (method) {
    case 'getAllTransactions':
      return [
        check('account_id', inputErrors.accountId)
          .exists()
          .bail()
          .isInt()
      ];
    case 'getTransactionsPerDate':
      return [
        check('account_id', inputErrors.accountId)
          .exists()
          .bail()
          .isInt(),
        check('initial_date', inputErrors.initialDate)
          .exists()
          .bail()
          .isISO8601(),
        check('final_date', inputErrors.finalDate)
          .exists()
          .bail()
          .isISO8601()
      ];
    case 'getUsersNamesFavoritesTransfer':
      return [
        check('account_id', inputErrors.accountId)
          .exists()
          .bail()
          .isInt()
      ];
    case 'getAccountsFavoritesTransfer':
      return [
        check('account_id', inputErrors.accountId)
          .exists()
          .bail()
          .isInt(),
        check('user_id', inputErrors.userId)
          .exists()
          .bail()
          .isInt()
      ];
    case 'depositOrWithdraw':
      return [
        check('account_id', inputErrors.accountId)
          .exists()
          .bail()
          .isInt(),
        check('value', inputErrors.value)
          .exists()
          .bail()
          .isFloat()
      ];
    case 'transfer':
      return [
        check('sender_account_id', inputErrors.senderAccountId)
          .exists()
          .bail()
          .isInt(),
        check('value', inputErrors.value)
          .exists()
          .bail()
          .isFloat(),
        check('receiver_account_id', inputErrors.receiverAccountId)
          .exists()
          .bail()
          .isInt(),
        check('cpf', inputErrors.cpf)
          .exists()
          .bail()
          .isInt()
          .isLength({ min: 11, max: 11 })
      ];
    default:
      console.log('Default Account Validation!');
  }
};

export default validation;
