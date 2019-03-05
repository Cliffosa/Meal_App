process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import user from '../src/models/admin';
const expect = require('chai').expect;
chai.use(chaiHttp);
