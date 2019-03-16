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
describe('Order Endpoints', () => {
  context('Admin can Get all Orders', () => {
    it(`GET ${PREFIX}/orders - Fetch All Orders (Unauthorized)`, done => {
      chai
        .request(server)
        .get(`${PREFIX}/orders`)
        .then(res => {
          expect(res).to.have.status(401);
          assert.equal(res.body.status, 'error getting token');
          done();
        })
        .catch(err => console.log('GET /orders', err.message));
    });
    it(`GET ${PREFIX}/orders - Admin can Fetch All Orders - Authorized`, done => {
      Admin.findOne({ where: { email: admin0_Payload.email } })
        .then(admin => {
          const { id, name, email, phone } = admin;
          const token = jwt.sign(
            {
              admin: { id, name, email, phone },
              isAdmin: true
            },
            secret,
            {
              expiresIn: ONE_WEEK
            }
          );
          chai
            .request(server)
            .get(`${PREFIX}/orders`)
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
              expect(res).to.have.status(200);
              assert.equal(res.body.status, true);
              done();
            })
            .catch(err => console.log('GET /orders', err.message));
        })
        .catch(err => console.log(err.errors[0].name));
    });
  });
  // context('Add to Orders User Unauthorized', () => {
  //   Admin.create(admin0_Payload)
  //     .then(admin => {
  //       return Meal.create({
  //         name: 'Dummy Meal',
  //         price: 500,
  //         imageUrl: 'fk.png',
  //         adminId: admin.id
  //       });
  //     })
  //     .then(meal => {
  //       it(`POST ${PREFIX}/orders - Add To Orders (Unauthorized)`, done => {
  //         chai
  //           .request(server)
  //           .post(`${PREFIX}/orders`)
  //           .send({
  //             mealId: meal.id,
  //             quantity: 1
  //           });
  //         const resolvingPromise = new Promise(resolve => {
  //           resolve('error');
  //         });
  //         resolvingPromise
  //           .then(res => {
  //             expect(res).to.have.status(401);
  //             assert.equal(res.body.status, 'error');
  //           })
  //           .finally(done)
  //           .catch(err => console.log('POST /orders', err.message));
  //       });
  //       it(`POST ${PREFIX}/orders - Add To Orders - (User can Add to Order)`, done => {
  //         User.findOne({ where: { email: user0_Payload.email } }).then(user => {
  //           const { id, name, email, phone } = user;
  //           const token = jwt.sign(
  //             {
  //               user: { id, name, email, phone }
  //             },
  //             secret,
  //             {
  //               expiresIn: ONE_WEEK
  //             }
  //           );
  //           chai
  //             .request(server)
  //             .post(`${PREFIX}/orders`)
  //             .set('Authorization', `Bearer ${token}`)
  //             .send({
  //               mealId: meal.id,
  //               quantity: 11
  //             });
  //           const resolvingPromise = new Promise(resolve => {
  //             resolve('success');
  //           });
  //           resolvingPromise
  //             .then(res => {
  //               expect(res).to.have.status(200);
  //               assert.equal(res.body.status, 'success');
  //             })
  //             .finally(done)
  //             .catch(err => console.log('POST /orders', err.message));
  //         });
  //       });
  //     })
  //     .catch(err => console.log(err.message));
  // });
});

after(done => {
  User.destroy({ where: { email: user0_Payload.email } })
    .then(async () => {
      await Admin.destroy({ where: { email: admin0_Payload.email } });
      await Admin.destroy({ where: { email: admin1_Payload.email } });
      await User.destroy({ where: { email: user0_Payload.email } });
      return User.destroy({ where: { email: user1_Payload.email } });
    })
    .then(() => {
      done();
    });
});
