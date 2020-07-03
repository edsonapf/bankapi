import { check } from 'express-validator';
import { inputErrors } from '../errors/accountErrors';

const validation = method => {
  switch (method) {
    case 'createAccount':
      return [
        check('user_id', inputErrors.userId)
          .exists()
          .bail()
          .isInt(),
        check('main', inputErrors.main)
          .exists()
          .bail()
          .isBoolean()
      ];
    case 'checkUserId':
      return [
        check('user_id', inputErrors.userId)
          .exists()
          .bail()
          .isInt()
      ];
    case 'checkAccountId':
      return [
        check('account_id', inputErrors.accountId)
          .exists()
          .bail()
          .isInt()
      ];
    case 'changeMainAccount':
      return [
        check('user_id', inputErrors.userId)
          .exists()
          .bail()
          .isInt(),
        check('account_id', inputErrors.accountId)
          .exists()
          .bail()
          .isInt()
      ];
    default:
      console.log('Default Account Validation!');
  }
};

export default validation;
