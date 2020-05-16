import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PORT } from './config/env';
import userRoutes from './app/routes/users';
import accountRoutes from './app/routes/accounts';
import transactionRoutes from './app/routes/transactions';

const port = PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use('/users', userRoutes);
app.use('/accounts', accountRoutes);
app.use('/transactions', transactionRoutes);

app.use((req, res, next) => {
  return res.status(404).json({ error: 'not found' });
});

app.use((err, req, res, next) => {
  return res.status(500).json({ error: 'internal server error' });
});

export default app;
