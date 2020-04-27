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

routes.post('/createAccount', validationToken, validation('createAccount'), createAccount);

routes.put('/mainAccount', validationToken, validation('checkAccountId'), changeMainAccount);

routes.delete('/deleteAccount', validationToken, validation('checkAccountId'), deleteAccount);

export default routes;
