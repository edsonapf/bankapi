import { Router } from 'express';
import {
  validation,
  getUserById,
  getUserByCpf,
  createUser,
  deleteUser
} from '../controllers/users';

const routes = new Router();

routes.get('/:userId', validation('getUserById'), getUserById);

routes.get('/userCpf', getUserByCpf);

routes.post('/createUser', createUser);

routes.delete('/deleteUser/:userId', deleteUser);

export default routes;
