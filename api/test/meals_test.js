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
  context('Get all Meals (Caterer)', () => {
    it(`GET ${PREFIX}/meals/ - Fetch All Meals (Unauthorized)`, done => {
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
    it(`GET ${PREFIX}/meals/ - Fetch All Meals - (Caterer Authorized)`, done => {
      Caterer.findOne({ where: { email: catererPayload.email } })
        .then(caterer => {
          const { id, name, email, phone } = caterer;
          const token = jwt.sign(
            {
              caterer: { id, name, email, phone },
              isCaterer: true
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

  context('Add Meal Option (Caterer)', () => {
    it(`POST ${PREFIX}/meals/ - Add Meal Option (Unauthorized)`, done => {
      chai
        .request(server)
        .post(`${PREFIX}/meals/`)
        .send({
          name: 'Test Meal',
          price: '500'
        })
        .then(res => {
          expect(res).to.have.status(401);
          assert.equal(res.body.status, 'error');
          done();
        })
        .catch(err => console.log('POST /meals/', err.message));
    });
    it(`POST ${PREFIX}/meals/ - Add Meal Option - (Validation Test)`, done => {
      Caterer.findOne({ where: { email: catererPayload.email } })
        .then(caterer => {
          const token = jwt.sign(
            {
              caterer: {
                id: caterer.id,
                name: caterer.name,
                email: caterer.email,
                phone: caterer.phone
              },
              isCaterer: true
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
              name: 'Test Meal',
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
    it(`POST ${PREFIX}/meals/ - Add Meal Option - (Caterer Can Add Meal Option)`, done => {
      Caterer.findOne({ where: { email: catererPayload.email } })
        .then(caterer => {
          const token = jwt.sign(
            {
              caterer: {
                id: caterer.id,
                name: caterer.name,
                email: caterer.email,
                phone: caterer.phone
              },
              isCaterer: true
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
            .field('name', 'Test Meal')
            .field('price', '500')
            .attach('image', './test_images/test.png', 'test.png')
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

  context('Modify Meal Option (Caterer)', () => {
    duplicateImage()
      .then(() => {
        Caterer.create(caterer2Payload).then(caterer => {
          return Meal.create({
            name: 'Fake Meal',
            price: 1000,
            imageUrl: '/api/images/fake.png',
            catererId: caterer.id
          }).then(meal => {
            it(`PUT ${PREFIX}/meals/:mealId - Modify Meal Option (Unauthorized)`, done => {
              chai
                .request(server)
                .put(`${PREFIX}/meals/${meal.id}`)
                .send({
                  name: 'Test Meal 2',
                  price: 600
                })
                .then(res => {
                  expect(res).to.have.status(401);
                  assert.equal(res.body.status, 'error');
                  done();
                })
                .catch(err => console.log('PUT /meals/:mealId', err.message));
            });
            it(`PUT ${PREFIX}/meals/:mealId - Modify Meal Option - (Validation Test)`, done => {
              Caterer.findOne({ where: { email: caterer2Payload.email } })
                .then(caterer => {
                  const token = jwt.sign(
                    {
                      caterer: {
                        id: caterer.id,
                        name: caterer.name,
                        email: caterer.email,
                        phone: caterer.phone
                      },
                      isCaterer: true
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
            it(`PUT ${PREFIX}/meals/:mealId - Modify Meal Option - (Caterer Can Modify Meal Option)`, done => {
              Caterer.findOne({ where: { email: caterer2Payload.email } })
                .then(caterer => {
                  const token = jwt.sign(
                    {
                      caterer: {
                        id: caterer.id,
                        name: caterer.name,
                        email: caterer.email,
                        phone: caterer.phone
                      },
                      isCaterer: true
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
                    .field('name', 'Test Meal 2')
                    .field('price', '600')
                    .attach('image', './test_images/test2.jpg', 'test2.jpg')
                    .then(res => {
                      expect(res).to.have.status(200);
                      assert.equal(res.body.status, 'success');
                      fs.unlink('./api/images/test2.jpg', err => {
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

  context('Delete Meal Option (Caterer)', () => {
    duplicateImage('fake2.png')
      .then(() => {
        Caterer.create(caterer3Payload)
          .then(caterer => {
            return Meal.create({
              name: 'Fake Meal',
              price: 1000,
              imageUrl: '/api/images/fake2.png',
              catererId: caterer.id
            });
          })
          .then(meal => {
            it(`DELETE ${PREFIX}/meals/:mealId - Delete Meal (Unauthorized)`, done => {
              chai
                .request(server)
                .delete(`${PREFIX}/meals/${meal.id}`)
                .then(res => {
                  expect(res).to.have.status(401);
                  assert.equal(res.body.status, 'error');
                  done();
                })
                .catch(err => console.log('DELETE /meals/:mealId', err.message));
            });
            it(`DELETE ${PREFIX}/meals/:mealId - Delete Meal - (Caterer Authorized - Meal does not exist)`, done => {
              Caterer.findOne({ where: { email: caterer3Payload.email } })
                .then(caterer => {
                  const { id, name, email, phone } = caterer;
                  const token = jwt.sign(
                    {
                      caterer: { id, name, email, phone },
                      isCaterer: true
                    },
                    secret,
                    {
                      expiresIn: ONE_WEEK
                    }
                  );
                  chai
                    .request(server)
                    .delete(`${PREFIX}/meals/${100000}`)
                    .set('Authorization', `Bearer ${token}`)
                    .then(res => {
                      expect(res).to.have.status(500);
                      assert.equal(res.body.status, 'error');
                      done();
                    })
                    .catch(err => console.log('DELETE /meals/:mealId', err.message));
                })
                .catch(err => console.log(err.message));
            });
            it(`DELETE ${PREFIX}/meals/:mealId - Delete Meal - (Caterer Authorized)`, done => {
              Caterer.findOne({ where: { email: caterer3Payload.email } })
                .then(caterer => {
                  const { id, name, email, phone } = caterer;
                  const token = jwt.sign(
                    {
                      caterer: { id, name, email, phone },
                      isCaterer: true
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
                    .catch(err => console.log('DELETE /meals/:mealId', err.message));
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
