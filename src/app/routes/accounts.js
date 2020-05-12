import { Router } from 'express';
import { validationToken } from '../../config/auth';
import {
  createAccount,
  getAccountsByUserId,
  changeMainAccount,
  deleteAccount
} from '../controllers/accounts';
import validation from '../utils/accountValidation';

const routes = new Router();

routes.get('/:userId', validationToken, validation('checkUserId'), getAccountsByUserId);

routes.post('/create-account', validationToken, validation('createAccount'), createAccount);

routes.put(
  '/main-account/:accountId',
  validationToken,
  validation('checkAccountId'),
  changeMainAccount
);

routes.delete(
  '/delete-account/:accountId',
  validationToken,
  validation('checkAccountId'),
  deleteAccount
);

export default routes;
