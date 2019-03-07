process.env.NODE_ENV = 'test';
import fs from 'fs';
import path from 'path';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import jwt from 'jsonwebtoken';
import secret from '../src/util/jwt';
import Admin from '../src/models/admin';
import Meal from '../src/models/meals';
const { assert, expect } = chai;
chai.use(chaiHttp);

// const srcImg = '../testImage/3.jpg';
// const imageFolder = '../src/images';

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

describe('Amin Get all Meals', () => {
  it(`GET /api/v1/meals/ - Fetch All Meals Unauthorized`, done => {
    chai
      .request(server)
      .get(`/api/v1/meals/`)
      .then(res => {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      })
      .catch(err => console.log('GET /meals/', err.message));
  });
  it(`GET /api/v1/meals/ - Fetch All Meals - (Admin Authorized)`, done => {
    Admin.findOne({ where: { email: admin1_Payload.email } })
      .then(admin => {
        const { id, name, email, phone } = admin;
        const token = jwt.sign(
          {
            admin: { id, name, email, phone },
            isAdmin: true
          },
          secret,
          {
            expiresIn: 86400
          }
        );
        chai
          .request(server)
          .get(`/api/v1/meals/`)
          .set('Authorization', `Bearer ${token}`)
          .then(res => {
            expect(res).to.have.status(200);
            assert.equal(res.body.status, 'success');
            done();
          })
          .catch(err => console.log('GET /meals/', err.message));
      })
      .catch(err => console.log(err.message));
  });
});

describe('Admin Add Meal ', () => {
  it(`POST /api/v1/meals/ - Add Meal Unauthorized`, done => {
    chai
      .request(server)
      .post(`/api/v1/meals/`)
      .send({
        name: 'Koko Garri',
        price: 500
      })
      .then(res => {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      })
      .catch(err => console.log('POST /meals/', err.message));
  });
  it(`POST /api/v1/meals/ - Add Meal Option - Validate`, done => {
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
            expiresIn: '1h'
          }
        );
        chai
          .request(server)
          .post(`/api/v1/meals/`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'koko Garri',
            price: 500
          })
          .then(res => {
            expect(res).to.have.status(400);
            assert.equal(res.body.status, 'error');
            done();
          })
          .catch(err => console.log('POST /meals/', err.message));
      })
      .catch(err => console.log(err.message));
  });
  it(`POST /api/v1/meals/ - Add Meal  - Admin Can Add Meal Option`, done => {
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
            expiresIn: '1h'
          }
        );
        chai
          .request(server)
          .post(`/api/v1/meals/`)
          .set('Authorization', `Bearer ${token}`)
          .field('name', 'fufu')
          .field('price', 500)
          .field('quantity', 'small')
          .attach('image', '../testImages/3.png', '3.png')
          .then(res => {
            expect(res).to.have.status(200);
            assert.equal(res.body.status, 'success');
            done();
          })
          .catch(err => console.log('POST /meals/', err.message));
      })
      .catch(err => console.log(err.message));
  });
});

describe('Admin Can Modify Meal', () => {
  Admin.create(admin1_Payload)
    .then(admin => {
      return Meal.create({
        name: 'rice',
        price: 1000,
        quantity: 3,
        adminId: admin.id
      });
    })
    .then(meal => {
      it(`PUT /api/v1/meals/:Id - Modify Meal Option Unauthorized`, done => {
        chai
          .request(server)
          .put(`/api/v1/meals/${meal.id}`)
          .send({
            name: 'beans',
            price: 600
          })
          .then(res => {
            expect(res).to.have.status(401);
            assert.equal(res.body.status, 'error');
            done();
          })
          .catch(err => console.log('PUT /meals/:Id', err.message));
      });
      it(`PUT /api/v1/meals/:Id - Modify Meal Option = Validate`, done => {
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
                expiresIn: '1h'
              }
            );
            chai
              .request(server)
              .put(`/api/v1/meals/${meal.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send({
                name: 'stew'
              })
              .then(res => {
                expect(res).to.have.status(400);
                assert.equal(res.body.status, 'error');
                done();
              })
              .catch(err => console.log('POST /meals/:Id', err.message));
          })
          .catch(err => console.log(err.message));
      });

      it(`PUT /api/v1/meals/:Id - Modify Meal Option Admin Can Modify Meal Option`, done => {
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
                expiresIn: 86400
              }
            );
            chai
              .request(server)
              .put(`/api/v1/meals/${meal.id}`)
              .set('Authorization', `Bearer ${token}`)
              .field('name', 'meal')
              .field('price', 200)
              .attach('image', '../testImage/3.jpg', '3.jpg')
              .then(res => {
                expect(res).to.have.status(200);
                assert.equal(res.body.status, 'success');
                fs.unlink('../src/images/3.jpg', err => {
                  if (err) console.log(err.message);
                });
                Meal.destroy({ where: { id: meal.id } }).then(() => {
                  done();
                });
              })
              .catch(err => console.log('POST /meals/:Id', err.message));
          })
          .catch(err => console.log(err.message));
      });
    });
});

describe('Admin Can Delete Meal', () => {
  Admin.create(admin1_Payload)
    .then(admin => {
      return Meal.create({
        name: 'rice',
        price: 1000,
        quantity: 3,
        adminId: admin.id
      });
    })
    .then(meal => {
      it(`/api/v1/meals/:Id - Delete Meal (Unauthorized)`, done => {
        chai
          .request(server)
          .delete(`/api/v1/meals/${meal.id}`)
          .then(res => {
            expect(res).to.have.status(401);
            assert.equal(res.body.status, 'error');
            done();
          })
          .catch(err => console.log('DELETE /meals/:Id', err.message));
      });
      it(`DELETE /api/v1/meals/:Id - Delete Meal - Authorized`, done => {
        Admin.findOne({ where: { email: admin0_Payload.email } })
          .then(admin => {
            const { id, name, email, phone } = admin;
            const token = jwt.sign(
              {
                caterer: { id, name, email, phone },
                isAdmin: true
              },
              secret,
              {
                expiresIn: '1h'
              }
            );
            chai
              .request(server)
              .delete(`/api/v1/meals/${meal.id}`)
              .set('Authorization', `Bearer ${token}`)
              .then(res => {
                expect(res).to.have.status(200);
                assert.equal(res.body.status, 'success');
                done();
              })
              .catch(err => console.log('DELETE /meals/:Id', err.message));
          })
          .catch(err => console.log(err.message));
      });
    });
});

after(done => {
  Admin.destroy({ where: { email: admin0_Payload.email } })
    .then(async () => {
      await Admin.destroy({ where: { email: admin1_Payload.email } });
      return Admin.destroy({ where: { email: admin0_Payload.email } });
    })
    .then(() => {
      done();
    });
});
