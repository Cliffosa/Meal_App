import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import router from '../src/routes/index';
import cors from 'cors';
import sequelize from './util/db';
import { config } from 'dotenv';
import { Client } from 'pg';
import User from './models/user';
import Admin from './models/admin';
import Meal from './models/meals';
import Menu from './models/menu';
import Order from './models/orders';
import OrderItem from './models/orderItems';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();
const PORT = process.env.PORT || 8000;
config();
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
client.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', Routes);

app.get('/', (req, res) => {
  return res.status(200).send({
    message: `Welcome To Book-A-Meal-App Book-A-Meal is an application that allows customers to make food orders and helps the food vendor know what the customers want to eat.`
  });
});

// relationship
User.hasMany(Order, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(OrderItem, { constraints: true, onDelete: 'CASCADE' });
Order.belongsTo(Admin, { constraints: true, onDelete: 'CASCADE' });
Meal.belongsTo(Admin, { constraints: true, onDelete: 'CASCADE' });
Menu.belongsTo(Admin, { constraints: true, onDelete: 'CASCADE' });
OrderItem.belongsTo(Meal, { constraints: true, onDelete: 'CASCADE' });

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening to port ${PORT}`);
      console.log('Connection has been established successfully.');
      app.emit('dbConnected');
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default app;
