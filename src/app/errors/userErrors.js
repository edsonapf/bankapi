import { inputErrors as defaultInputErrors } from './defaultErrors';

export const inputErrors = {
  userId: defaultInputErrors.userId,
  cpf: defaultInputErrors.cpf,
  password: defaultInputErrors.password,
  name: 'name parameter is required',
  email: defaultInputErrors.email,
  address: 'address parameter is required',
  house_number: 'house_number parameter is required and must be a number',
  state: 'state parameter is required',
  country: 'country parameter is required',
  zipcode: 'zipcode parameter is required and must have 8 numbers',
  birthday: 'birthday parameter is required and must be a date'
};
