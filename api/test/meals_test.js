process.env.NODE_ENV = 'test';
import fs from 'fs';
import path from 'path';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import jwt from 'jsonwebtoken';
import Admin from '../src/models/admin';
import Meal from '../src/models/meals';
import User from '../src/models/user';
import { config } from 'dotenv';

config();
const secret = process.env.JWT_SECRET;
const { assert, expect } = chai;
chai.use(chaiHttp);

const PREFIX = '/api/v1';
const ONE_WEEK = 60 * 60 * 24 * 7;

const srcImg = '../testImage/3.jpg';
const imageFolder = './api/src/images';

const duplicateImage = (filename = '3.png') => {
  return new Promise((resolve, reject) => {
    fs.access(imageFolder, err => {
      const readStream = fs.createReadStream(srcImg);
      readStream.once('error', error => {
        reject(error.message);
      });
      readStream.pipe(fs.createWriteStream(path.join(imageFolder, filename)));
      if (err) reject(err.message);
    });
    resolve(true);
  });
};

const user0_Payload = {
  name: 'user user',
  phone: '07060538862',
  email: 'user@gmail.com',
  password: 'user123456'
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
  Admin.create(admin1_Payload).then(() => {
    done();
  });
});

after(done => {
  Admin.destroy({ where: { email: admin0_Payload.email } })
    .then(async () => {
      await Admin.destroy({ where: { email: admin1_Payload.email } });
      await Admin.destroy({ where: { email: admin0_Payload.email } });
      return User.destroy({ where: { email: user0_Payload.email } });
    })
    .then(() => {
      done();
    });
});
