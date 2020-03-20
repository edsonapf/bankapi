import express from 'express';
import bodyParser from 'body-parser';
// import expressValidator from 'express-validator';
import userRoutes from './app/routes/users';

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
// app.use(expressValidator());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use('/users', userRoutes);

export default app;
