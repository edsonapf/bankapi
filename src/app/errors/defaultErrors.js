const requiredInt = 'parameter is required and must be a number.';

export const inputErrors = {
  userId: `user_id ${requiredInt}`,
  accountId: `account_id ${requiredInt}`,
  email: 'email parameter is required and must be like email@email.com',
  cpf: 'cpf parameter is required and must have 11 numbers', // Think in another message
  password: 'password parameter is required and must be between 6 and 20 characters',
  date: 'parameter is required and must be a date'
};
