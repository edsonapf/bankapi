import { check } from 'express-validator';
import { inputErrors } from '../errors/userErrors';

const validation = method => {
  switch (method) {
    case 'userId':
      return [
        check('user_id', inputErrors.userId)
          .exists()
          .bail()
          .isInt()
      ];
    case 'authenticate':
      return [
        check('cpf', inputErrors.cpf)
          .exists()
          .bail()
          .isInt()
          .isLength({ min: 11, max: 11 }),
        check('password', inputErrors.password)
          .exists()
          .bail()
          .isLength({ min: 6, max: 20 })
      ];
    case 'createUser':
      return [
        check('cpf', inputErrors.cpf)
          .exists()
          .bail()
          .isInt()
          .isLength({ min: 11, max: 11 }),
        check('email', inputErrors.email)
          .exists()
          .bail()
          .isEmail(),
        check('name', inputErrors.name).exists(),
        check('password', inputErrors.password)
          .exists()
          .bail()
          .isLength({ min: 6, max: 20 }),
        check('address', inputErrors.address)
          .exists()
          .bail(),
        check('house_number', inputErrors.house_number)
          .exists()
          .bail()
          .isInt(),
        check('state', inputErrors.state)
          .exists()
          .bail(),
        check('country', inputErrors.country)
          .exists()
          .bail(),
        check('zipcode', inputErrors.zipcode)
          .exists()
          .bail()
          .isInt()
          .isLength({ min: 8, max: 8 }),
        check('birthday', inputErrors.birthday)
          .exists()
          .bail()
          .isISO8601()
      ];
    case 'deleteUser':
      return [
        check('user_id', inputErrors.userId)
          .exists()
          .bail()
          .isInt()
      ];
    case 'updateUser':
      return [
        check('user_id', inputErrors.userId)
          .exists()
          .bail()
          .isInt(),
        check('cpf', inputErrors.cpf)
          .exists()
          .bail()
          .isInt()
          .isLength({ min: 11, max: 11 }),
        check('email', inputErrors.email)
          .exists()
          .bail()
          .isEmail(),
        check('name', inputErrors.name).exists(),
        check('password', inputErrors.password)
          .exists()
          .bail()
          .isLength({ min: 6, max: 20 }),
        check('address', inputErrors.address).exists(),
        check('house_number', inputErrors.house_number)
          .exists()
          .bail()
          .isInt(),
        check('state', inputErrors.state).exists(),
        check('country', inputErrors.cou).exists(),
        check('zipcode', inputErrors.zipcode)
          .exists()
          .bail()
          .isInt()
          .isLength({ min: 8, max: 8 }),
        check('birthday', inputErrors.birthday)
          .exists()
          .bail()
          .isISO8601()
      ];
    default:
      console.log('Default Validation!');
  }
};

export default validation;
