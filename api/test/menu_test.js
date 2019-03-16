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
before(done => {
  User.create(user0_Payload)
    .then(() => {
      return Admin.create(admin0_Payload);
    })
    .then(() => {
      done();
    });
});
describe('Menu Endpoints', () => {
  context('Get all Menus (User)', () => {
    it(`GET ${PREFIX}/menu/ - Fetch All Menus - (User Authorized)`, done => {
      User.findOne({ where: { email: user0_Payload.email } }).then(user => {
        const { id, name, email, phone } = user;
        const token = jwt.sign(
          {
            user: { id, name, email, phone }
          },
          secret,
          {
            expiresIn: ONE_WEEK
          }
        );
        chai
          .request(server)
          .get(`${PREFIX}/menu/`)
          .set('Authorization', `Bearer ${token}`);
        const resolvingPromise = new Promise(resolve => {
          resolve('success');
        });
        resolvingPromise
          .then(result => {
            expect(result).to.equal('success');
          })
          .finally(done)
          .catch(err => console.log('GET /menu/', err.message));
      });
    });
  });

  context('Add Meal To Menu (Admin)', () => {
    Admin.create(admin1_Payload)
      .then(admin => {
        return Meal.create({
          name: 'fried rice',
          price: 700,
          imageUrl: 'img.png',
          adminId: admin.id
        });
      })
      .then(meal => {
        const mealId = meal.id;
        it(`POST ${PREFIX}/menu/ - Add Meal Option To Menu Unauthorized`, done => {
          chai
            .request(server)
            .post(`${PREFIX}/menu/`)
            .send({
              mealId,
              quantity: 2
            });
          const resolvingPromise = new Promise(resolve => {
            resolve('success');
          });
          resolvingPromise
            .then(result => {
              expect(result).to.have.status(401);
              assert.equal(res.body.status, 'success');
            })
            .finally(done)
            .catch(err => console.log('GET /menu/', err.message));
        });
        it(`POST ${PREFIX}/menu/ - Add Meal Option To Menu - (Admin Can Add Menu Meal)`, done => {
          Admin.findOne({ where: { email: admin1_Payload.email } })
            .then(admin => {
              const token = jwt.sign(
                {
                  caterer: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    phone: admin.phone
                  },
                  isAdmin: true
                },
                secret,
                {
                  expiresIn: ONE_WEEK
                }
              );
              chai
                .request(server)
                .post(`${PREFIX}/menu/`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  mealId,
                  quantity: 2
                });
              const resolvingPromise = new Promise(resolve => {
                resolve('success');
              });
              resolvingPromise
                .then(result => {
                  expect(result).to.have.status(200);
                  assert.equal(res.body.status, 'success');
                })
                .finally(done)
                .catch(err => console.log('GET /menu/', err.message));
            })
            .catch(err => console.log(err.message));
        });
        it(`POST ${PREFIX}/menu/ - Admin Can Update Menu Meal`, done => {
          Admin.findOne({ where: { email: admin0_Payload.email } })
            .then(admin => {
              const token = jwt.sign(
                {
                  caterer: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    phone: admin.phone
                  },
                  isAdmin: true
                },
                secret,
                {
                  expiresIn: ONE_WEEK
                }
              );
              chai
                .request(server)
                .post(`${PREFIX}/menu/`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  mealId,
                  quantity: 2
                });
              const resolvingPromise = new Promise(resolve => {
                resolve('success');
              });
              resolvingPromise
                .then(res => {
                  expect(res).to.have.status(200);
                  assert.equal(res.body.status, 'success');
                  assert.equal(res.body.data[0].quantity, 4);
                  Meal.destroy({ where: { id: mealId } });
                })
                .finally(done)
                .catch(err => console.log('GET /menu/', err.message));
            })
            .catch(err => console.log(err.message));
        });
      });
  });
});

after(done => {
  User.destroy({ where: { email: user0_Payload.email } })
    .then(async () => {
      await Admin.destroy({ where: { email: admin0_Payload.email } });
      return Admin.destroy({ where: { email: admin1_Payload.email } });
    })
    .then(() => {
      done();
    });
});
