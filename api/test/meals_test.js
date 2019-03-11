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
const imageFolder = '../src/images';

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

describe('Meals Endpoints', () => {
  context('Admin Get all Meals ', () => {
    it(`GET ${PREFIX}/meals/ - Fetch All Meals Unauthorized`, done => {
      chai
        .request(server)
        .get(`${PREFIX}/meals/`)
        .then(res => {
          expect(res).to.have.status(401);
          assert.equal(res.body.status, 'error');
          done();
        })
        .catch(err => console.log('GET /meals/', err.message));
    });
    it(`GET ${PREFIX}/meals/ - Fetch All Meals (User Unauthorized)`, done => {
      User.findOne({ where: { email: userPayload.email } })
        .then(user => {
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
            .get(`${PREFIX}/meals/`)
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
              expect(res).to.have.status(401);
              assert.equal(res.body.status, 'error');
              done();
            })
            .catch(err => console.log('GET /meals/', err.message));
        })
        .catch(err => console.log(err.message));
    });
    it(`GET ${PREFIX}/meals/ - Fetch All Meals - Admin Authorized)`, done => {
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
              expiresIn: ONE_WEEK
            }
          );
          chai
            .request(server)
            .get(`${PREFIX}/meals/`)
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

  context('Admin Add Meal Option )', () => {
    it(`POST ${PREFIX}/meals/ - Add Meal Option (Unauthorized)`, done => {
      chai
        .request(server)
        .post(`${PREFIX}/meals/`)
        .send({
          name: 'meal',
          price: '500'
        })
        .then(res => {
          expect(res).to.have.status(401);
          assert.equal(res.body.status, 'error');
          done();
        })
        .catch(err => console.log('POST /meals/', err.message));
    });
    it(`POST ${PREFIX}/meals/ - Add Meal Option *** Validation Test`, done => {
      Admin.findOne({ where: { email: admin0_Payload.email } })
        .then(admin => {
          const token = jwt.sign(
            {
              admin: {
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
            .post(`${PREFIX}/meals/`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              name: 'meal',
              price: '500'
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
    it(`POST ${PREFIX}/meals/ - Add Meal Option `, done => {
      Admin.findOne({ where: { email: Admin0_Payload.email } })
        .then(admin => {
          const token = jwt.sign(
            {
              admin: {
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
            .post(`${PREFIX}/meals/`)
            .set('Authorization', `Bearer ${token}`)
            .field('name', 'meal')
            .field('price', '3000')
            .attach('image', '../testImages/3.jpg', '3.jpg')
            .then(res => {
              expect(res).to.have.status(201);
              assert.equal(res.body.status, 'success');
              done();
            })
            .catch(err => console.log('POST /meals/', err.message));
        })
        .catch(err => console.log(err.message));
    });
  });

  context('Modify Meal Option ', () => {
    duplicateImage()
      .then(() => {
        Admin.create(admin0_Payload).then(admin => {
          return Meal.create({
            name: 'fufu',
            price: 100,
            imageUrl: '../src/images/3.jpg',
            mealId: admin.id
          }).then(meal => {
            it(`PUT ${PREFIX}/meals/:Id - Modify Meal Option (Unauthorized)`, done => {
              chai
                .request(server)
                .put(`${PREFIX}/meals/${meal.id}`)
                .send({
                  name: 'meal meal',
                  price: 300
                })
                .then(res => {
                  expect(res).to.have.status(401);
                  assert.equal(res.body.status, 'error');
                  done();
                })
                .catch(err => console.log('PUT /meals/:mealId', err.message));
            });
            it(`PUT ${PREFIX}/meals/:mealId - Modify Meal Option Validate`, done => {
              Admin.findOne({ where: { email: admin0_Payload.email } })
                .then(admin => {
                  const token = jwt.sign(
                    {
                      admin: {
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
                    .put(`${PREFIX}/meals/${meal.id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                      name: 300
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
            it(`PUT ${PREFIX}/meals/:Id - Modify Meal Option - (Admin)`, done => {
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
                    .put(`${PREFIX}/meals/${meal.id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .field('name', 'meal meal')
                    .field('price', '400')
                    .attach('image', '../testImage/3.jpg', '3.jpg')
                    .then(res => {
                      expect(res).to.have.status(200);
                      assert.equal(res.body.status, 'success');
                      fs.unlink('../src/images/2.jpg', err => {
                        if (err) console.log(err.message);
                      });
                      Meal.destroy({ where: { id: meal.id } }).then(() => {
                        done();
                      });
                    })
                    .catch(err => console.log('POST /meals/', err.message));
                })
                .catch(err => console.log(err.message));
            });
          });
        });
      })
      .catch(err => console.log(err.message));
  });

  context('Admin Delete Meal Option ', () => {
    duplicateImage('fake2.png')
      .then(() => {
        Admin.create(admin1_Payload)
          .then(admin => {
            return Meal.create({
              name: 'meal',
              price: 550,
              imageUrl: '../src/images/2.jpg',
              adminId: admin.id
            });
          })
          .then(meal => {
            it(`DELETE ${PREFIX}/meals/:Id - Delete Meal *** Unauthorized`, done => {
              chai
                .request(server)
                .delete(`${PREFIX}/meals/${meal.id}`)
                .then(res => {
                  expect(res).to.have.status(401);
                  assert.equal(res.body.status, 'error');
                  done();
                })
                .catch(err => console.log('DELETE /meals/:Id', err.message));
            });
            it(`DELETE ${PREFIX}/meals/:Id - Delete Meal *** Authorized)`, done => {
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
                    .delete(`${PREFIX}/meals/${meal.id}`)
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
      })
      .catch(err => console.log(err.message));
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
