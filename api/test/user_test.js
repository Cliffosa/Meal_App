process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import user from '../src/models/user';
const expect = require('chai').expect;
chai.use(chaiHttp);
