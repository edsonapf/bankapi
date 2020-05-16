import { check } from 'express-validator';

const validation = method => {
  switch (method) {
    case 'userId':
      return [
        check('user_id', 'UserId should be an integer.')
          .exists()
          .bail()
          .isInt()
      ];
    case 'authenticate':
      return [
        check('cpf', 'CPF should be an integer with 11 numbers.')
          .exists()
          .bail()
          .isInt()
          .isLength({ min: 11, max: 11 }),
        check('password', 'Password error message will be defined after.')
          .exists()
          .bail()
          .isLength({ min: 6, max: 20 })
      ];
    case 'createUser':
      return [
        check('cpf', 'CPF should be an integer with 11 numbers.')
          .exists()
          .bail()
          .isInt()
          .isLength({ min: 11, max: 11 }),
        check('email', 'Email error message will be defined after.')
          .exists()
          .bail()
          .isEmail(),
        check('name', 'Name should be sended.').exists(),
        check('password', 'Password error message will be defined after.')
          .exists()
          .bail()
          .isLength({ min: 6, max: 20 }),
        check('address', 'Address should be sended.')
          .exists()
          .bail(),
        check('house_number', 'House Number should be an integer.')
          .exists()
          .bail()
          .isInt(),
        check('state', 'State should be sended.')
          .exists()
          .bail(),
        check('country', 'Country should be sended.')
          .exists()
          .bail(),
        check('zipcode', 'ZipCode should be an integer with 8 numbers.')
          .exists()
          .bail()
          .isInt()
          .isLength({ min: 8, max: 8 }),
        check('birthday', 'Birthday should be a date.')
          .exists()
          .bail()
          .isISO8601()
      ];
    case 'deleteUser':
      return [
        check('user_id', 'UserId should be sended.')
          .exists()
          .bail()
          .isInt()
      ];
    case 'updateUser':
      return [
        check('user_id', 'UserId should be sended.')
          .exists()
          .bail()
          .isInt(),
        check('cpf', 'CPF should be an integer with 11 numbers.')
          .exists()
          .bail()
          .isInt()
          .isLength({ min: 11, max: 11 }),
        check('email', 'Email error message will be defined after.')
          .exists()
          .bail()
          .isEmail(),
        check('name', 'Name should be sended.').exists(),
        check('password', 'Password error message will be defined after.')
          .exists()
          .bail()
          .isLength({ min: 6, max: 20 }),
        check('address', 'Address should be sended.').exists(),
        check('house_number', 'House Number should be an integer.')
          .exists()
          .bail()
          .isInt(),
        check('state', 'State should be sended.').exists(),
        check('country', 'Country should be sended.').exists(),
        check('zipcode', 'ZipCode should be an integer with 8 numbers.')
          .exists()
          .bail()
          .isInt()
          .isLength({ min: 8, max: 8 }),
        check('birthday', 'Birthday should be a date.')
          .exists()
          .bail()
          .isISO8601()
      ];
    default:
      console.log('Default Validation!');
  }
};

export default validation;
