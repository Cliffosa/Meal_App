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
  context('Admin Get all Orders', () => {
    it(`GET ${PREFIX}/orders - Fetch All Orders Unauthorized`, done => {
      chai
        .request(server)
        .get(`${PREFIX}/orders`)
        .then(res => {
          expect(res).to.have.status(401);
          assert.equal(res.body.status, 'error');
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
              assert.equal(res.body.status, 'success');
              done();
            })
            .catch(err => console.log('GET /orders', err.message));
        })
        .catch(err => console.log(err.errors[0].name));
    });
  });

  context('User Can Add to Orders', () => {
    Admin.create(admin1_Payload)
      .then(admin => {
        return Meal.create({
          name: 'meal',
          price: 500,
          quantity: 3,
          imageUrl: 'meal.png',
          adminId: admin.id
        });
      })
      .then(meal => {
        it(`POST ${PREFIX}/orders - Add To Orders *** Unauthorized`, done => {
          chai
            .request(server)
            .post(`${PREFIX}/orders`)
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
        it(`POST ${PREFIX}/orders - Add To Orders *** Validation Test`, done => {
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
              .post(`${PREFIX}/orders`)
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
        it(`POST ${PREFIX}/orders - User can Add To Orders`, done => {
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
              .post(`${PREFIX}/orders`)
              .set('Authorization', `Bearer ${token}`)
              .send({
                mealId: meal.id,
                quantity: 1
              })
              .then(res => {
                expect(res).to.have.status(200);
                assert.equal(res.body.status, 'success');
                done();
              })
              .catch(err => console.log('POST /orders', err.message));
          });
        });
        it(`POST ${PREFIX}/orders *** User Cannot increament Order Item quantity from this route)`, done => {
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
              .post(`${PREFIX}/orders`)
              .set('Authorization', `Bearer ${token}`)
              .send({
                mealId: meal.id,
                quantity: 1
              })
              .then(res => {
                expect(res).to.have.status(200);
                assert.equal(res.body.status, 'warning');
                Meal.destroy({ where: { id: meal.id } }).then(() => {
                  done();
                });
              })
              .catch(err => console.log('POST /orders', err.message));
          });
        });
      })
      .catch(err => console.log(err.message));
  });

  context('Modify Orders Users *** increase, decrease, delete order items', () => {
    Admin.create(admin1_Payload)
      .then(admin => {
        return Meal.create({
          name: 'meal',
          price: 500,
          quantity: 4,
          imageUrl: 'meal.png',
          adminId: admin.id
        });
      })
      .then(meal => {
        User.create(user1_Payload)
          .then(user => {
            return OrderItem.create({ mealId: meal.id, quantity: 3, userId: user.id });
          })
          .then(orderItem => {
            it(`PUT ${PREFIX}/orders/:Id - Modify Orders (Unauthorized)`, done => {
              chai
                .request(server)
                .put(`${PREFIX}/orders/${orderItem.id}`)
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
            it(`PUT ${PREFIX}/orders/:Id - Modify Orders (Validation Test)`, done => {
              User.findOne({ where: { email: user1_Payload.email } }).then(user => {
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
                  .put(`${PREFIX}/orders/${orderItem.id}`)
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    action: 'positive'
                  })
                  .then(res => {
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'error');
                    done();
                  })
                  .catch(err => console.log('PUT /orders/:Id', err.message));
              });
            });
            it(`PUT ${PREFIX}/orders/:Id - User Can Increase Order Quantity`, done => {
              User.findOne({ where: { email: user1_Payload.email } }).then(user => {
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
                  .put(`${PREFIX}/orders/${orderItem.id}`)
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    action: 'increase'
                  })
                  .then(res => {
                    expect(res).to.have.status(200);
                    assert.equal(res.body.status, 'success');
                    done();
                  })
                  .catch(err => console.log('PUT /orders/:Id', err.message));
              });
            });
            it(`PUT ${PREFIX}/orders/:Id - User Can Decrease Order Quantity`, done => {
              User.findOne({ where: { email: user1_Payload.email } }).then(user => {
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
                  .put(`${PREFIX}/orders/${orderItem.id}`)
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    action: 'decrease'
                  })
                  .then(res => {
                    expect(res).to.have.status(200);
                    assert.equal(res.body.status, 'success');
                    done();
                  })
                  .catch(err => console.log('PUT /orders/:Id', err.message));
              });
            });
            it(`PUT ${PREFIX}/orders/:Id - User Can Delete Order)`, done => {
              User.findOne({ where: { email: user1_Payload.email } }).then(user => {
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
                  .put(`${PREFIX}/orders/${orderItem.id}`)
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    action: 'delete'
                  })
                  .then(res => {
                    expect(res).to.have.status(200);
                    assert.equal(res.body.status, 'success');
                    done();
                  })
                  .catch(err => console.log('PUT /orders/:Id', err.message));
              });
            });
          });
      })
      .catch(err => console.log(err.message));
  });

  context('User Get Order Items (User)', () => {
    Admin.create(admin0_Payload)
      .then(admin => {
        return Meal.create({
          name: 'meal',
          price: 500,
          quantity: 4,
          imageUrl: 'meal.png',
          adminId: admin.id
        });
      })
      .then(meal => {
        User.create(user0_Payload)
          .then(user => {
            return OrderItem.create({ mealId: meal.id, quantity: 11, userId: user.id });
          })
          .then(() => {
            it(`GET ${PREFIX}/orders/user - Fetch Order Items Unauthorized`, done => {
              chai
                .request(server)
                .get(`${PREFIX}/orders/user`)
                .then(res => {
                  expect(res).to.have.status(401);
                  assert.equal(res.body.status, 'error');
                  done();
                })
                .catch(err => console.log('GET /orders/user', err.message));
            });
            it(`GET ${PREFIX}/orders/user - Fetch Order Items *** User Authorized`, done => {
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
                  .get(`${PREFIX}/orders/user`)
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

  context('Checkout Orders (User)', () => {
    Admin.create(admin0_Payload)
      .then(admin => {
        return Meal.create({
          name: 'meal',
          price: 600,
          quantity: 2,
          imageUrl: 'meal.png',
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
        User.create(user1_Payload)
          .then(user => {
            const meals = JSON.parse(menu.meals);
            return OrderItem.create({ mealId: meals[0].id, quantity: 2, userId: user.id });
          })
          .then(() => {
            it(`POST ${PREFIX}/orders/checkout - Order Checkout *** Unauthorized`, done => {
              chai
                .request(server)
                .post(`${PREFIX}/orders/checkout`)
                .send({
                  delivery_address: 'London'
                })
                .then(res => {
                  expect(res).to.have.status(401);
                  assert.equal(res.body.status, 'error');
                  done();
                })
                .catch(err => console.log('POST /orders/checkout', err.message));
            });
            it(`POST ${PREFIX}/orders/checkout *** Checkout Validation Test`, done => {
              User.findOne({ where: { email: user1_Payload.email } }).then(user => {
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
                  .post(`${PREFIX}/orders/checkout`)
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    delivery_address: 8
                  })
                  .then(res => {
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'error');
                    done();
                  })
                  .catch(err => console.log('POST /orders/checkout', err.message));
              });
            });
            it(`POST ${PREFIX}/orders/checkout *** User Can Not Checkout without order items)`, done => {
              User.create(user0_Payload).then(user => {
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
                  .post(`${PREFIX}/orders/checkout`)
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    delivery_address: 'Festac'
                  })
                  .then(res => {
                    expect(res).to.have.status(500);
                    assert.equal(res.body.status, 'error');
                    done();
                  })
                  .catch(err => console.log('POST /orders/checkout', err.message));
              });
            });
            it(`POST ${PREFIX}/orders/checkout *** User Can Checkout`, done => {
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
                  .post(`${PREFIX}/orders/checkout`)
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    delivery_address: 'Ilupeju'
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
