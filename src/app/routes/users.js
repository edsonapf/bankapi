import { Router } from 'express';
import {
  getUserById,
  getAllUsers,
  authenticate,
  createUser,
  deleteUser,
  updateUser
} from '../controllers/users';
import {
  validationToken,
  refreshToken,
  destroyAccessToken,
  destroyRefreshToken
} from '../../config/auth/index';
import validation from '../utils/userValidation';

const routes = new Router();

routes.get('/:userId', validation('getUserById'), getUserById);
routes.get('/', validationToken, getAllUsers);

routes.post('/login', validation('authenticate'), authenticate);
routes.post('/logout', destroyAccessToken, destroyRefreshToken);
routes.post('/refreshToken', refreshToken);

routes.post('/createUser', validation('createUser'), createUser);

routes.put('/updateUser/:userId', validation('updateUser'), updateUser);

routes.delete('/deleteUser/:userId', validation('deleteUser'), deleteUser);

export default routes;
