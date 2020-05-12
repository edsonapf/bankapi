import { check } from 'express-validator';

const validation = method => {
  switch (method) {
    case 'getAllTransactions':
      return [
        check('accountId', 'You have to pass the accountId.')
          .exists()
          .isInt()
      ];
    case 'getTransactionsPerDate':
      return [
        check('accountId', 'You have to pass the accountId.')
          .exists()
          .isInt(),
        check('initialDate', 'You have to pass the initial date.')
          .exists()
          .isISO8601()
          .toDate(),
        check('finalDate', 'You have to pass the final date.')
          .exists()
          .isISO8601()
          .toDate()
      ];
    case 'depositOrWithdraw':
      return [
        check('accountId', 'You have to pass the accountId.')
          .exists()
          .isInt(),
        check('value', 'You have to pass the transaction value')
          .exists()
          .isFloat()
      ];
    case 'transfer':
      return [
        check(
          'senderAccountId',
          'You have to pass the accountId of the person who is sending the money.'
        )
          .exists()
          .isInt(),
        check('value', 'You have to pass the transaction value')
          .exists()
          .isFloat(),
        check(
          'receiverAccountId',
          'You have to pass the accountId of the person who is receiving the money.'
        )
          .exists()
          .isInt()
      ];
    default:
      console.log('Default Account Validation!');
  }
};

export default validation;
