process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import User from '../src/models/user';
const expect = require('chai').expect;
chai.use(chaiHttp);

let login_details = {
  email_or_username: 'email@email.com',
  password: '123@abc'
};

let register_details = {
  fullName: 'Rexford',
  email: 'email@email.com',
  username: 'username',
  password: '123@abc'
};
