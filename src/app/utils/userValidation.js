import { param, check } from 'express-validator';

const validation = method => {
  switch (method) {
    case 'getUserById':
      return [
        param('userId', 'UserId should be an integer.')
          .isInt()
          .exists()
      ];
    case 'authenticate':
      return [
        check('cpf', 'CPF should be an integer with 11 numbers.')
          .isInt()
          .isLength({ min: 11, max: 11 })
          .exists(),
        check('password', 'Password error message will be defined after.')
          .isLength({ min: 6, max: 20 })
          .exists()
      ];
    case 'createUser':
      return [
        check('cpf', 'CPF should be an integer with 11 numbers.')
          .isInt()
          .isLength({ min: 11, max: 11 }),
        check('email', 'Email error message will be defined after.')
          .isEmail()
          .exists(),
        check('name', 'Name should be sended.').exists(),
        check('password', 'Password error message will be defined after.')
          .isLength({ min: 6, max: 20 })
          .exists(),
        check('address', 'Address should be sended.').exists(),
        check('houseNumber', 'House Number should be an integer.')
          .exists()
          .isInt(),
        check('state', 'State should be sended.').exists(),
        check('country', 'Country should be sended.').exists(),
        check('zipcode', 'ZipCode should be an integer with 8 numbers.')
          .isInt()
          .isLength({ min: 8, max: 8 })
          .exists(),
        check('birthday', 'Birthday should be a date.').exists()
      ];
    case 'deleteUser':
      return [
        check('userId', 'UserId should be sended.')
          .isInt()
          .exists()
      ];
    case 'updateUser':
      return [
        check('userId', 'UserId should be sended.')
          .isInt()
          .exists(),
        check('cpf', 'CPF should be an integer with 11 numbers.')
          .isInt()
          .isLength({ min: 11, max: 11 }),
        check('email', 'Email error message will be defined after.')
          .isEmail()
          .exists(),
        check('name', 'Name should be sended.').exists(),
        check('password', 'Password error message will be defined after.')
          .isLength({ min: 6, max: 20 })
          .exists(),
        check('address', 'Address should be sended.').exists(),
        check('houseNumber', 'House Number should be an integer.')
          .exists()
          .isInt(),
        check('state', 'State should be sended.').exists(),
        check('country', 'Country should be sended.').exists(),
        check('zipcode', 'ZipCode should be an integer with 8 numbers.')
          .isInt()
          .isLength({ min: 8, max: 8 })
          .exists(),
        check('birthday', 'Birthday should be a date.').exists()
      ];
    default:
      console.log('Default Validation!');
  }
};

export default validation;
