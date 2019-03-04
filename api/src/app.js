import express from 'express';
import bodyParser from 'body-parser';
import router from '../src/routes/index';
import cors from 'cors';
import sequelize from './util/db';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(router);

app.get('/', (req, res) => {
  return res.status(200).send({
    message: `Welcome To Book-A-Meal-App Book-A-Meal is an application that allows customers to make food orders and helps the foodvendor know what the customers want to eat.`
  });
});
const PORT = process.env.PORT || 8000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening to port ${PORT}`);
      console.log('Connection has been established successfully.');
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default app;
