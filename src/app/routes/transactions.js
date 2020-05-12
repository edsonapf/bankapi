import { Router } from 'express';
import {
  getAllTransactionByAccountId,
  getTransactionsPerDate,
  deposit,
  withdraw,
  transfer
} from '../controllers/transactions';
import validation from '../utils/transactionValidation';
import { validationToken } from '../../config/auth';

const routes = new Router();

routes.get(
  '/:accountId',
  validationToken,
  validation('getAllTransactions'),
  getAllTransactionByAccountId
);
routes.get(
  '/transactions-per-date/:accountId',
  validationToken,
  validation('getTransactionsPerDate'),
  getTransactionsPerDate
);

routes.post('/deposit', validationToken, validation('depositOrWithdraw'), deposit);
routes.post('/withdraw', validationToken, validation('depositOrWithdraw'), withdraw);
routes.post('/transfer', validationToken, validation('transfer'), transfer);

export default routes;
