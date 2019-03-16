process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import User from '../src/models/user';
import Admin from '../src/models/admin';
import Meal from '../src/models/meals';

config();
const secret = process.env.JWT_SECRET;
const { assert, expect } = chai;
chai.use(chaiHttp);

const PREFIX = '/api/v1';
const ONE_WEEK = 60 * 60 * 24 * 7;

const user0_Payload = {
  name: 'steve burma',
  email: 'burma@gmail.com',
  phone: '09078909098',
  password: 'steve12345'
};
const user1_Payload = {
  name: 'steve Joe',
  email: 'steve@gmail.com',
  phone: '09078909098',
  password: 'steve12345'
};

const admin0_Payload = {
  name: 'andrei burma',
  email: 'andrei@gmail.com',
  phone: '07060538862',
  password: 'andrei12345'
};

const admin1_Payload = {
  name: 'cliff burma',
  email: 'cliff@gmail.com',
  phone: '09057996214',
  password: 'cliff12345'
};
