import { check } from 'express-validator';

const validation = method => {
  switch (method) {
    case 'getAllTransactions':
      return [
        check('account_id', 'You have to pass the accountId.')
          .exists()
          .bail()
          .isInt()
      ];
    case 'getTransactionsPerDate':
      return [
        check('account_id', 'You have to pass the account_id.')
          .exists()
          .bail()
          .isInt(),
        check('initial_date', 'You have to pass the initial date.')
          .exists()
          .bail()
          .isISO8601(),
        check('final_date', 'You have to pass the final date.')
          .exists()
          .bail()
          .isISO8601()
      ];
    case 'getUsersNamesFavoritesTransfer':
      return [
        check('account_id', 'You have to pass the account_id.')
          .exists()
          .bail()
          .isInt()
      ];
    case 'getAccountsFavoritesTransfer':
      return [
        check('account_id', 'You have to pass the account_id.')
          .exists()
          .bail()
          .isInt(),
        check('user_id', 'You have to pass the user_id.')
          .exists()
          .bail()
          .isInt()
      ];
    case 'depositOrWithdraw':
      return [
        check('account_id', 'You have to pass the account_id.')
          .exists()
          .bail()
          .isInt(),
        check('value', 'You have to pass the transaction value')
          .exists()
          .bail()
          .isFloat()
      ];
    case 'transfer':
      return [
        check(
          'sender_account_id',
          'You have to pass the accountId of the person who is sending the money.'
        )
          .exists()
          .bail()
          .isInt(),
        check('value', 'You have to pass the transaction value')
          .exists()
          .bail()
          .isFloat(),
        check(
          'receiver_account_id',
          'You have to pass the accountId of the person who is receiving the money.'
        )
          .exists()
          .bail()
          .isInt(),
        check('cpf', 'CPF should be an integer with 11 numbers.')
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
