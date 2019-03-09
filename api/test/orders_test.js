process.env.NODE_ENV = 'test';
import fs from 'fs';
import path from 'path';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import jwt from 'jsonwebtoken';
import secret from '../src/util/jwt';
import User from '../src/models/user';
import Admin from '../src/models/admin';
import Menu from '../src/models/menu';
import Meal from '../src/models/meals';
import OrderItem from '../src/models/orderItems';
const { assert, expect } = chai;
chai.use(chaiHttp);

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

describe('Admin Get all Orders Endpoint ', () => {
  it(`GET /api/v1/orders - Fetch All Orders (Unauthorized)`, done => {
    chai
      .request(server)
      .get(`/api/v1/orders`)
      .then(res => {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      })
      .catch(err => console.log('GET /orders', err.message));
  });
  it(`GET /apii/v1/orders - Fetch All Orders - Authorized`, done => {
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
            expiresIn: '2h'
          }
        );
        chai
          .request(server)
          .get(`api/v1/orders`)
          .set('Authorization', `Bearer ${token}`)
          .then(res => {
            expect(res).to.have.status(200);
            assert.equal(res.body.status, 'success');
            done();
          })
          .catch(err => console.log('GET /orders', err.message));
      })
      .catch(err => console.log(err.errors[0].name));
  });
});

describe('User can add to Orders Endpoint ', () => {
  Admin.create(admin0_Payload)
    .then(admin => {
      return Meal.create({
        name: 'fried Meat',
        price: 1500,
        imageUrl: 'meat.png',
        adminId: admin.id
      });
    })
    .then(meal => {
      it(`POST /api/v1/orders - Add To Orders (Unauthorized)`, done => {
        chai
          .request(server)
          .post(`/api/v1/orders`)
          .send({
            mealId: meal.id,
            quantity: 1
          })
          .then(res => {
            expect(res).to.have.status(401);
            assert.equal(res.body.status, 'error');
            done();
          })
          .catch(err => console.log('POST /orders', err.message));
      });

      it(`POST /api/v1/orders - Add To Orders == Validation Test`, done => {
        User.findOne({ where: { email: user0_Payload.email } }).then(user => {
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
            .post(`/api/v1/orders`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              mealId: meal.id
            })
            .then(res => {
              expect(res).to.have.status(400);
              assert.equal(res.body.status, 'error');
              done();
            })
            .catch(err => console.log('POST /orders', err.message));
        });
      });
      it(`POST /api/v1/orders - Add To Orders - (User can Add to Order)`, done => {
        User.findOne({ where: { email: user1_Payload.email } }).then(user => {
          const { id, name, email, phone } = user;
          const token = jwt.sign(
            {
              user: { id, name, email, phone }
            },
            secret,
            {
              expiresIn: '2h'
            }
          );
          chai
            .request(server)
            .post(`/api/v1/orders`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              mealId: meal.id,
              quantity: 'small'
            })
            .then(res => {
              expect(res).to.have.status(200);
              assert.equal(res.body.status, 'success');
              done();
            })
            .catch(err => console.log('POST /orders', err.message));
        });
      });
    })
    .catch(err => console.log(err.message));
});

describe('User can Modify Orders Endpoints', () => {
  Admin.create(admin0_Payload)
    .then(admin => {
      return Meal.create({
        name: 'Dummy Meal',
        price: 500,
        quantity: 4,
        imageUrl: 'fk.png',
        adminId: admin.id
      });
    })
    .then(meal => {
      User.create(user2Payload)
        .then(user => {
          return OrderItem.create({ mealId: meal.id, quantity: 3, userId: user.id });
        })
        .then(orderItem => {
          it(`PUT ${API_PREFIX}/orders/:orderId - Modify Orders (Unauthorized)`, done => {
            chai
              .request(app)
              .put(`${API_PREFIX}/orders/${orderItem.id}`)
              .send({
                action: 'increase'
              })
              .then(res => {
                expect(res).to.have.status(401);
                assert.equal(res.body.status, 'error');
                done();
              })
              .catch(err => console.log('PUT /orders/:orderId', err.message));
          });
          it(`PUT ${API_PREFIX}/orders/:orderId - Modify Orders (Validation Test)`, done => {
            User.findOne({ where: { email: user2Payload.email } }).then(user => {
              const { id, name, email, phone } = user;
              const token = jwt.sign(
                {
                  user: { id, name, email, phone }
                },
                secret,
                {
                  expiresIn: 86400
                }
              );
              chai
                .request(app)
                .put(`${API_PREFIX}/orders/${orderItem.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  action: 'something'
                })
                .then(res => {
                  expect(res).to.have.status(400);
                  assert.equal(res.body.status, 'error');
                  done();
                })
                .catch(err => console.log('PUT /orders/:orderId', err.message));
            });
          });
          it(`PUT ${API_PREFIX}/orders/:orderId - Modify Orders (User Can Increase Order Quantity)`, done => {
            User.findOne({ where: { email: user2Payload.email } }).then(user => {
              const { id, name, email, phone } = user;
              const token = jwt.sign(
                {
                  user: { id, name, email, phone }
                },
                secret,
                {
                  expiresIn: 86400
                }
              );
              chai
                .request(app)
                .put(`${API_PREFIX}/orders/${orderItem.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  action: 'increase'
                })
                .then(res => {
                  expect(res).to.have.status(200);
                  assert.equal(res.body.status, 'success');
                  done();
                })
                .catch(err => console.log('PUT /orders/:orderId', err.message));
            });
          });
          it(`PUT ${API_PREFIX}/orders/:orderId - Modify Orders (User Can Decrease Order Quantity)`, done => {
            User.findOne({ where: { email: user2Payload.email } }).then(user => {
              const { id, name, email, phone } = user;
              const token = jwt.sign(
                {
                  user: { id, name, email, phone }
                },
                secret,
                {
                  expiresIn: 86400
                }
              );
              chai
                .request(app)
                .put(`${API_PREFIX}/orders/${orderItem.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  action: 'decrease'
                })
                .then(res => {
                  expect(res).to.have.status(200);
                  assert.equal(res.body.status, 'success');
                  done();
                })
                .catch(err => console.log('PUT /orders/:orderId', err.message));
            });
          });
          it(`PUT ${API_PREFIX}/orders/:orderId - Modify Orders (User Can Delete Order)`, done => {
            User.findOne({ where: { email: user2Payload.email } }).then(user => {
              const { id, name, email, phone } = user;
              const token = jwt.sign(
                {
                  user: { id, name, email, phone }
                },
                secret,
                {
                  expiresIn: 86400
                }
              );
              chai
                .request(app)
                .put(`${API_PREFIX}/orders/${orderItem.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  action: 'delete'
                })
                .then(res => {
                  expect(res).to.have.status(200);
                  assert.equal(res.body.status, 'success');
                  done();
                })
                .catch(err => console.log('PUT /orders/:orderId', err.message));
            });
          });
        });
    })
    .catch(err => console.log(err.message));
});

describe('Admin Can Get their Menu Endpoint ', () => {
  Admin.create(admin1_Payload)
    .then(admin => {
      return Meal.create({
        name: 'shawama',
        price: 2000,
        quantity: 'large',
        imageUrl: 'shawama.png',
        adminId: admin.id
      });
    })
    .then(meal => {
      User.create(user0_Payload)
        .then(user => {
          return OrderItem.create({ mealId: meal.id, quantity: 'medium', userId: user.id });
        })
        .then(() => {
          it(`GET /api/v1/orders/user - Fetch Order Items (Unauthorized)`, done => {
            chai
              .request(server)
              .get(`/api/v1/orders/user`)
              .then(res => {
                expect(res).to.have.status(401);
                assert.equal(res.body.status, 'error');
                done();
              })
              .catch(err => console.log('GET /orders/user', err.message));
          });
          it(`GET /api/v1/orders/user - Fetch Order Items - (User Authorized)`, done => {
            User.findOne({ where: { email: user0_Payload.email } }).then(user => {
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
                .get(`/api/v1/orders/user`)
                .set('Authorization', `Bearer ${token}`)
                .then(res => {
                  expect(res).to.have.status(200);
                  assert.equal(res.body.status, 'success');
                  done();
                })
                .catch(err => console.log('GET /orders/user', err.message));
            });
          });
        });
    });
});

describe('User can Checkout Orders Endpoint ', () => {
  Admin.create(admin0_Payload)
    .then(admin => {
      return Meal.create({
        name: 'fried rice',
        price: 2000,
        quantity: 'large',
        imageUrl: 'rice.png',
        adminId: admin.id
      });
    })
    .then(meal => {
      const newMenu = [];
      newMenu.push({
        id: meal.id,
        name: meal.name,
        price: meal.price,
        quantity: meal.quantity,
        imageUrl: meal.imageUrl,
        adminId: meal.adminId
      });
      return Menu.create({ meals: JSON.stringify(newMenu), adminId: meal.adminId });
    })
    .then(menu => {
      User.create(user0_Payload)
        .then(user => {
          const meals = JSON.parse(menu.meals);
          return OrderItem.create({ mealId: meals[0].id, quantity: 'small', userId: user.id });
        })
        .then(() => {
          it(`POST /api/v1/orders/checkout - Order Checkout (Unauthorized)`, done => {
            chai
              .request(server)
              .post(`/api/v1/orders/checkout`)
              .send({
                delivery_address: 'festac lagos'
              })
              .then(res => {
                expect(res).to.have.status(401);
                assert.equal(res.body.status, 'error');
                done();
              })
              .catch(err => console.log('POST /orders/checkout', err.message));
          });
          it(`POST /api/v1/orders/checkout - Order Checkout (Validation Test)`, done => {
            User.findOne({ where: { email: user0_Payload.email } }).then(user => {
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
                .post(`/api/v1/orders/checkout`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  delivery_address: 'satellite lagos'
                })
                .then(res => {
                  expect(res).to.have.status(400);
                  assert.equal(res.body.status, 'error');
                  done();
                })
                .catch(err => console.log('POST /orders/checkout', err.message));
            });
          });
          it(`POST /api/v1/orders/checkout - Order Checkout (User Can Checkout)`, done => {
            User.findOne({ where: { email: user1_Payload.email } }).then(user => {
              const { id, name, email, phone } = user;
              const token = jwt.sign(
                {
                  user: { id, name, email, phone }
                },
                secret,
                {
                  expiresIn: '2h'
                }
              );
              chai
                .request(server)
                .post(`/api/v1/orders/checkout`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  delivery_address: 'Okota Lagos'
                })
                .then(res => {
                  expect(res).to.have.status(201);
                  assert.equal(res.body.status, 'success');
                  done();
                })
                .catch(err => console.log('POST /orders/checkout', err.message));
            });
          });
        });
    })
    .catch(err => console.log(err.message));
});

after(done => {
  User.destroy({ where: { email: user0_Payload.email } })
    .then(async () => {
      await Admin.destroy({ where: { email: admin0_Payload.email } });
      await Admin.destroy({ where: { email: admin1_Payload.email } });
      await User.destroy({ where: { email: user1_Payload.email } });
      await User.destroy({ where: { email: user0_Payload.email } });
    })
    .then(() => {
      done();
    });
});
