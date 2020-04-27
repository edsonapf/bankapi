import { check } from 'express-validator';

const validation = method => {
  switch (method) {
    case 'createAccount':
      return [
        check('userId', 'You have to pass the userId on the query param.')
          .exists()
          .isInt(),
        check('main', 'You have to pass if the account is the main on the query param.')
          .exists()
          .isBoolean()
      ];
    case 'checkUserId':
      return [
        check('userId', 'You have to pass the userId.')
          .exists()
          .isInt()
      ];
    case 'checkAccountId':
      return [
        check('accountId', 'You have to pass the accountId.')
          .exists()
          .isInt()
      ];
    default:
      console.log('Default Account Validation!');
  }
};

export default validation;
