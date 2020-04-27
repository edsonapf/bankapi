import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './app/routes/users';
import accountRoutes from './app/routes/accounts';

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use('/users', userRoutes);
app.use('/accounts', accountRoutes);

app.use((req, res, next) => {
  console.log(req.url);
  return res.status(404).json({ error: 'not found' });
});

app.use((err, req, res, next) => {
  return res.status(500).json({ error: 'internal server error' });
});

export default app;
