process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import jwt from 'jsonwebtoken';
import secret from '../src/util/jwt';
import User from '../src/models/user';
import Admin from '../src/models/admin';
import Meal from '../src/models/meals';
const { assert, expect } = chai;
chai.use(chaiHttp);

const user_Payload = {
  name: 'steve burma',
  email: 'burma@gmail.com',
  phone: '09078909098',
  password: 'steve12345'
};

const admin0_Payload = {
  name: 'andrei burma',
  email: 'andrei@gmail.com',
  phone: '09078909098',
  password: 'andrei12345'
};

const admin1_Payload = {
  name: 'cliff burma',
  email: 'cliff@gmail.com',
  phone: '09057996214',
  password: 'cliff12345'
};

before(done => {
  User.create(user_Payload)
    .then(() => {
      return Admin.create(admin0_Payload);
    })
    .then(() => {
      done();
    });
});

describe('User Get all Menus Endpoints', () => {
  it(`GET/api/v1/menu/ - Fetch All Menus Unauthorized`, done => {
    chai
      .request(server)
      .get(`/api/v1/menu/`)
      .then(res => {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      })
      .catch(err => console.log('GET /menu/', err.message));
  });

  it(`GET / api / v1 / menu / - Fetch All Menus ----- User Authorized`, done => {
    User.findOne({ where: { email: user_Payload.email } }).then(user => {
      const { id, name, email, phone } = user;
      const token = jwt.sign(
        {
          user: { id, name, email, phone }
        },
        secret,
        {
          expiresIn: '1h'
        }
      );
      chai
        .request(server)
        .get(`/api/v1/menu/`)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          assert.equal(res.body.status, 'success');
          done();
        })
        .catch(err => console.log('GET /menu/', err.message));
    });
  });
});

describe('Admin Can Get their Menu Endpoint', () => {
  it(`/aoi/v1/menu/admin - Fetch Menu (Unauthorized)`, done => {
    chai
      .request(app)
      .get(`/api/v1/menu/admin`)
      .then(res => {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      })
      .catch(err => console.log('GET /menu/admin', err.message));
  });

  it(`GET /api/v1/menu/admin - Fetch Menu - (Admin Authorized)`, done => {
    Admin.findOne({ where: { email: admin0_Payload.email } }).then(admin => {
      const { id, name, email, phone } = admin;
      const token = jwt.sign(
        {
          admin: { id, name, email, phone },
          isAdmin: true
        },
        secret,
        {
          expiresIn: '1h'
        }
      );
      chai
        .request(server)
        .get(`api/v1/menu/admin`)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          assert.equal(res.body.status, 'success');
          done();
        })
        .catch(err => console.log('GET /menu/caterer', err.message));
    });
  });
});

describe('Admin Can Add Meal To Menu Endpoint', () => {
  Admin.create(admin1_Payload)
    .then(admin => {
      return Meal.create({
        name: 'white soup',
        price: 400,
        imageUrl: 'img.png',
        quantity: 'small',
        adminId: admin.id
      });
    })
    .then(meal => {
      const Id = meal.id;
      it(`POST /api/v1/menu/ - Add Meal Option To Menu ==== Unauthorized`, done => {
        chai
          .request(server)
          .post(`/api/v1/menu/`)
          .send({
            Id,
            quantity: 'small'
          })
          .then(res => {
            expect(res).to.have.status(401);
            assert.equal(res.body.status, 'error');
            done();
          })
          .catch(err => console.log('POST /menu/', err.message));
      });

      it(`POST api/v1/menu/ - Add Meal To Menu === Admin Can Add Menu Meal`, done => {
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
              .post(`/api/v1/menu/`)
              .set('Authorization', `Bearer ${token}`)
              .send({
                mealId,
                quantity: 'small'
              })
              .then(res => {
                expect(res).to.have.status(200);
                assert.equal(res.body.status, 'success');
                done();
              })
              .catch(err => console.log('POST /menu/', err.message));
          })
          .catch(err => console.log(err.message));
      });
      it(`POST api/v1/menu/ - Add Meal To Menu === Admin Can Update Menu Meal`, done => {
        Admin.findOne({ where: { email: admin0_Payload.email } }).then(admin => {
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
            .post(`/api/v1/menu/`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              mealId,
              quantity: 2
            })
            .then(res => {
              expect(res).to.have.status(200);
              assert.equal(res.body.status, 'success');
              assert.equal(res.body.data[0].quantity, 2);
              Meal.update({ where: { id: mealId } }).then(() => {
                done();
              });
            })
            .catch(err => console.log('POST /menu/', err.message));
        });
      });
    })
    .catch(err => console.log(err.message));
});

after(done => {
  User.destroy({ where: { email: user_Payload.email } })
    .then(async () => {
      await Admin.destroy({ where: { email: admin0_Payload.email } });
      return Admin.destroy({ where: { email: admin1_Payload.email } });
    })
    .then(() => {
      done();
    });
});
