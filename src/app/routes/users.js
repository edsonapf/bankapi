import { Router } from 'express';
import { getUserById, getUserByCpf, createUser, deleteUser } from '../controllers/users';

const routes = new Router();

routes.get('/:userId', getUserById);

routes.get('/userCpf', getUserByCpf);

routes.post('/createUser', createUser);

routes.delete('/deleteUser/:userId', deleteUser);

export default routes;
