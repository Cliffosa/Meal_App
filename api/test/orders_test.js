process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import jwt from 'jsonwebtoken';
import User from '../src/models/user';
import Admin from '../src/models/admin';
import Menu from '../src/models/menu';
import Meal from '../src/models/meals';
import OrderItem from '../src/models/orderItems';
import { config } from 'dotenv';

config();

const secret = process.env.JWT_SECRET;
const { assert, expect } = chai;
chai.use(chaiHttp);

const PREFIX = '/api/v1';
const ONE_WEEK = 60 * 60 * 24 * 7;

const user0_Payload = {
  name: 'Wale Cliff',
  email: 'wale@ymail.com',
  phone: '07090909080',
  password: 'wale123456'
};

const user1_Payload = {
  name: 'Ola David',
  email: 'ola@ymail.com',
  phone: '07090909080',
  password: 'david123456'
};

const admin0_Payload = {
  name: 'admin admin',
  phone: '07060538862',
  email: 'admin@gmail.com',
  password: 'admin123456'
};

const admin1_Payload = {
  name: 'admin1 admin1',
  phone: '09057996214',
  email: 'admin1@gmail.com',
  password: 'admin123456'
};

before(done => {
  User.create(user0_Payload)
    .then(() => {
      return Admin.create(admin0_Payload);
    })
    .then(() => {
      done();
    });
});

after(done => {
  User.destroy({ where: { email: user0_Payload.email } })
    .then(async () => {
      await Admin.destroy({ where: { email: admin0_Payload.email } });
      await Admin.destroy({ where: { email: admin1_Payload.email } });
      await User.destroy({ where: { email: user1_Payload.email } });
      await User.destroy({ where: { email: user0_Payload.email } });
    })
    .then(() => {
      done();
    });
});
