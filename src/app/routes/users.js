import { Router } from 'express';
import {
  getUserById,
  getAllUsers,
  authenticate,
  createUser,
  deleteUser,
  updateUser,
  uploadPhoto
} from '../controllers/users';
import {
  validationToken,
  refreshToken,
  destroyAccessToken,
  destroyRefreshToken
} from '../../config/auth/index';
import validation from '../utils/userValidation';
import upload from '../../config/utils/fileUpload';

const routes = new Router();

routes.get('/:userId', validation('userId'), getUserById);
routes.get('/', getAllUsers);

routes.post('/login', validation('authenticate'), authenticate);
routes.post('/logout', destroyAccessToken, destroyRefreshToken);
routes.post('/refresh-token', refreshToken);

routes.post('/create-user', validation('createUser'), createUser);

routes.put('/update-user/:userId', validationToken, validation('updateUser'), updateUser);
routes.put(
  '/update-user-photo/:user_id',
  validationToken,
  validation('userId'),
  upload.single('photo'),
  uploadPhoto
);

routes.delete('/delete-user/:userId', validationToken, validation('deleteUser'), deleteUser);

export default routes;
