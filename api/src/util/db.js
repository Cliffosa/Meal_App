import Sequelize from 'sequelize';
import { config } from 'dotenv';

config();

const { DATABASE_URL,  DB_NAME, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'postgres',
  url: DATABASE_URL,
  port: DB_PORT,
  host: DB_HOST,
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
