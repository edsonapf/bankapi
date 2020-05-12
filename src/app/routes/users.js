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
routes.get('/', getAllUsers);

routes.post('/login', validation('authenticate'), authenticate);
routes.post('/logout', destroyAccessToken, destroyRefreshToken);
routes.post('/refresh-token', refreshToken);

routes.post('/create-user', validation('createUser'), createUser);

routes.put('/update-user/:userId', validation('updateUser'), updateUser);

routes.delete('/delete-user/:userId', validation('deleteUser'), deleteUser);

export default routes;
