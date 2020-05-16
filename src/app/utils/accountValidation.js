import { check } from 'express-validator';

const validation = method => {
  switch (method) {
    case 'createAccount':
      return [
        check('user_id', 'You have to pass the userId at params.')
          .exists()
          .bail()
          .isInt(),
        check('main', 'You have to pass if the account is the main at params.')
          .exists()
          .bail()
          .isBoolean()
      ];
    case 'checkUserId':
      return [
        check('user_id', 'You have to pass the userId.')
          .exists()
          .bail()
          .isInt()
      ];
    case 'checkAccountId':
      return [
        check('account_id', 'You have to pass the accountId.')
          .exists()
          .bail()
          .isInt()
      ];
    case 'changeMainAccount':
      return [
        check('user_id', 'You have to pass the userId.')
          .exists()
          .bail()
          .isInt(),
        check('account_id', 'You have to pass the accountId.')
          .exists()
          .bail()
          .isInt()
      ];
    default:
      console.log('Default Account Validation!');
  }
};

export default validation;
