import { Router } from 'express';
import {
  getAllTransactionByAccountId,
  getTransactionsPerDate,
  deposit,
  withdraw,
  transfer,
  getUsersNamesFavoritesTransfer,
  getAccountsFavoritesTransfer
} from '../controllers/transactions';
import validation from '../utils/transactionValidation';
import { validationToken } from '../../config/auth';

const routes = new Router();

routes.get(
  '/:account_id',
  validationToken,
  validation('getAllTransactions'),
  getAllTransactionByAccountId
);
routes.get(
  '/transactions-per-date/:account_id',
  validationToken,
  validation('getTransactionsPerDate'),
  getTransactionsPerDate
);
routes.get(
  '/favorites-names-transfer/:account_id',
  validationToken,
  validation('getUsersNamesFavoritesTransfer'),
  getUsersNamesFavoritesTransfer
);
routes.get(
  '/favorites-accounts-transfer/:account_id/:user_id',
  validationToken,
  validation('getAccountsFavoritesTransfer'),
  getAccountsFavoritesTransfer
);

routes.post('/deposit', validationToken, validation('depositOrWithdraw'), deposit);
routes.post('/withdraw', validationToken, validation('depositOrWithdraw'), withdraw);
routes.post('/transfer', validationToken, validation('transfer'), transfer);

export default routes;
