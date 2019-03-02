import express from 'express';
import bodyParser from 'body-parser';
import router from '../src/routes/index';

// DATABASE;
import db from './util/db';
//TEST DB

// initialize express
const app = express();
//configure bodyParser for incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// use router
app.use(router);

app.get('/', (req, res) => {
  return res.status(200).send({
    message: `Welcome To Book-A-Meal-App Book-A-Meal is an application that allows customers to make food orders and helps the foodvendor know what the customers want to eat.`
  });
});

// assigned port variable
const PORT = process.env.PORT || 5000;

db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening to port ${PORT}`);
    });
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
// call app to listen to the port

export default app;
