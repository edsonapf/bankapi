import { inputErrors as defaultInputErrors } from './defaultErrors';

const requiredNumber = 'parameter is required and must be a number';

export const inputErrors = {
  userId: defaultInputErrors.userId,
  accountId: defaultInputErrors.accountId,
  initialDate: `initial_date ${defaultInputErrors.date}`,
  finalDate: `final_date ${defaultInputErrors.date}`,
  value: `value ${requiredNumber}`,
  senderAccountId: `sender_account_id ${requiredNumber}`,
  receiverAccountId: `receiver_account_id ${requiredNumber}`,
  cpf: defaultInputErrors.cpf
};
