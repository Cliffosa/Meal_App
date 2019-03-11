"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../src/app"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _user = _interopRequireDefault(require("../src/models/user"));

var _admin = _interopRequireDefault(require("../src/models/admin"));

var _menu = _interopRequireDefault(require("../src/models/menu"));

var _meals = _interopRequireDefault(require("../src/models/meals"));

var _orderItems = _interopRequireDefault(require("../src/models/orderItems"));

var _dotenv = require("dotenv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

process.env.NODE_ENV = 'test';
(0, _dotenv.config)();
var secret = process.env.JWT_SECRET;
var assert = _chai.default.assert,
    expect = _chai.default.expect;

_chai.default.use(_chaiHttp.default);

var PREFIX = '/api/v1';
var ONE_WEEK = 60 * 60 * 24 * 7;
var user0_Payload = {
  name: 'Wale Cliff',
  email: 'wale@ymail.com',
  phone: '07090909080',
  password: 'wale123456'
};
var user1_Payload = {
  name: 'Ola David',
  email: 'ola@ymail.com',
  phone: '07090909080',
  password: 'david123456'
};
var admin0_Payload = {
  name: 'admin admin',
  phone: '07060538862',
  email: 'admin@gmail.com',
  password: 'admin123456'
};
var admin1_Payload = {
  name: 'admin1 admin1',
  phone: '09057996214',
  email: 'admin1@gmail.com',
  password: 'admin123456'
};
before(function (done) {
  _user.default.create(user0_Payload).then(function () {
    return _admin.default.create(admin0_Payload);
  }).then(function () {
    done();
  });
});
describe('Order Endpoints', function () {
  context('Admin Get all Orders', function () {
    it("GET ".concat(PREFIX, "/orders - Fetch All Orders Unauthorized"), function (done) {
      _chai.default.request(_app.default).get("".concat(PREFIX, "/orders")).then(function (res) {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      }).catch(function (err) {
        return console.log('GET /orders', err.message);
      });
    });
    it("GET ".concat(PREFIX, "/orders - Admin can Fetch All Orders - Authorized"), function (done) {
      _admin.default.findOne({
        where: {
          email: admin0_Payload.email
        }
      }).then(function (admin) {
        var id = admin.id,
            name = admin.name,
            email = admin.email,
            phone = admin.phone;

        var token = _jsonwebtoken.default.sign({
          admin: {
            id: id,
            name: name,
            email: email,
            phone: phone
          },
          isAdmin: true
        }, secret, {
          expiresIn: ONE_WEEK
        });

        _chai.default.request(_app.default).get("".concat(PREFIX, "/orders")).set('Authorization', "Bearer ".concat(token)).then(function (res) {
          expect(res).to.have.status(200);
          assert.equal(res.body.status, 'success');
          done();
        }).catch(function (err) {
          return console.log('GET /orders', err.message);
        });
      }).catch(function (err) {
        return console.log(err.errors[0].name);
      });
    });
  });
  context('User Can Add to Orders', function () {
    _admin.default.create(admin1_Payload).then(function (admin) {
      return _meals.default.create({
        name: 'meal',
        price: 500,
        quantity: 3,
        imageUrl: 'meal.png',
        adminId: admin.id
      });
    }).then(function (meal) {
      it("POST ".concat(PREFIX, "/orders - Add To Orders *** Unauthorized"), function (done) {
        _chai.default.request(_app.default).post("".concat(PREFIX, "/orders")).send({
          Id: meal.id,
          quantity: 1
        }).then(function (res) {
          expect(res).to.have.status(401);
          assert.equal(res.body.status, 'error');
          done();
        }).catch(function (err) {
          return console.log('POST /orders', err.message);
        });
      });
      it("POST ".concat(PREFIX, "/orders - Add To Orders *** Validation Test"), function (done) {
        _user.default.findOne({
          where: {
            email: user0_Payload.email
          }
        }).then(function (user) {
          var id = user.id,
              name = user.name,
              email = user.email,
              phone = user.phone;

          var token = _jsonwebtoken.default.sign({
            user: {
              id: id,
              name: name,
              email: email,
              phone: phone
            }
          }, secret, {
            expiresIn: ONE_WEEK
          });

          _chai.default.request(_app.default).post("".concat(PREFIX, "/orders")).set('Authorization', "Bearer ".concat(token)).send({
            Id: meal.id
          }).then(function (res) {
            expect(res).to.have.status(400);
            assert.equal(res.body.status, 'error');
            done();
          }).catch(function (err) {
            return console.log('POST /orders', err.message);
          });
        });
      });
      it("POST ".concat(PREFIX, "/orders - User can Add To Orders"), function (done) {
        _user.default.findOne({
          where: {
            email: user0_Payload.email
          }
        }).then(function (user) {
          var id = user.id,
              name = user.name,
              email = user.email,
              phone = user.phone;

          var token = _jsonwebtoken.default.sign({
            user: {
              id: id,
              name: name,
              email: email,
              phone: phone
            }
          }, secret, {
            expiresIn: ONE_WEEK
          });

          _chai.default.request(_app.default).post("".concat(PREFIX, "/orders")).set('Authorization', "Bearer ".concat(token)).send({
            Id: meal.id,
            quantity: 1
          }).then(function (res) {
            expect(res).to.have.status(200);
            assert.equal(res.body.status, 'success');
            done();
          }).catch(function (err) {
            return console.log('POST /orders', err.message);
          });
        });
      });
      it("POST ".concat(PREFIX, "/orders *** User Cannot increament Order Item quantity from this route)"), function (done) {
        _user.default.findOne({
          where: {
            email: user0_Payload.email
          }
        }).then(function (user) {
          var id = user.id,
              name = user.name,
              email = user.email,
              phone = user.phone;

          var token = _jsonwebtoken.default.sign({
            user: {
              id: id,
              name: name,
              email: email,
              phone: phone
            }
          }, secret, {
            expiresIn: ONE_WEEK
          });

          _chai.default.request(_app.default).post("".concat(PREFIX, "/orders")).set('Authorization', "Bearer ".concat(token)).send({
            Id: meal.id,
            quantity: 1
          }).then(function (res) {
            expect(res).to.have.status(200);
            assert.equal(res.body.status, 'warning');

            _meals.default.destroy({
              where: {
                id: meal.id
              }
            }).then(function () {
              done();
            });
          }).catch(function (err) {
            return console.log('POST /orders', err.message);
          });
        });
      });
    }).catch(function (err) {
      return console.log(err.message);
    });
  });
  context('Modify Orders Users *** increase, decrease, delete order items', function () {
    _admin.default.create(admin1_Payload).then(function (admin) {
      return _meals.default.create({
        name: 'meal',
        price: 500,
        quantity: 4,
        imageUrl: 'meal.png',
        adminId: admin.id
      });
    }).then(function (meal) {
      _user.default.create(user1_Payload).then(function (user) {
        return _orderItems.default.create({
          mealId: meal.id,
          quantity: 3,
          userId: user.id
        });
      }).then(function (orderItem) {
        it("PUT ".concat(PREFIX, "/orders/:Id - Modify Orders (Unauthorized)"), function (done) {
          _chai.default.request(_app.default).put("".concat(PREFIX, "/orders/").concat(orderItem.id)).send({
            action: 'increase'
          }).then(function (res) {
            expect(res).to.have.status(401);
            assert.equal(res.body.status, 'error');
            done();
          }).catch(function (err) {
            return console.log('PUT /orders/:orderId', err.message);
          });
        });
        it("PUT ".concat(PREFIX, "/orders/:Id - Modify Orders (Validation Test)"), function (done) {
          _user.default.findOne({
            where: {
              email: user1_Payload.email
            }
          }).then(function (user) {
            var id = user.id,
                name = user.name,
                email = user.email,
                phone = user.phone;

            var token = _jsonwebtoken.default.sign({
              user: {
                id: id,
                name: name,
                email: email,
                phone: phone
              }
            }, secret, {
              expiresIn: ONE_WEEK
            });

            _chai.default.request(_app.default).put("".concat(PREFIX, "/orders/").concat(orderItem.id)).set('Authorization', "Bearer ".concat(token)).send({
              action: 'positive'
            }).then(function (res) {
              expect(res).to.have.status(400);
              assert.equal(res.body.status, 'error');
              done();
            }).catch(function (err) {
              return console.log('PUT /orders/:Id', err.message);
            });
          });
        });
        it("PUT ".concat(PREFIX, "/orders/:Id - User Can Increase Order Quantity"), function (done) {
          _user.default.findOne({
            where: {
              email: user1_Payload.email
            }
          }).then(function (user) {
            var id = user.id,
                name = user.name,
                email = user.email,
                phone = user.phone;

            var token = _jsonwebtoken.default.sign({
              user: {
                id: id,
                name: name,
                email: email,
                phone: phone
              }
            }, secret, {
              expiresIn: ONE_WEEK
            });

            _chai.default.request(_app.default).put("".concat(PREFIX, "/orders/").concat(orderItem.id)).set('Authorization', "Bearer ".concat(token)).send({
              action: 'increase'
            }).then(function (res) {
              expect(res).to.have.status(200);
              assert.equal(res.body.status, 'success');
              done();
            }).catch(function (err) {
              return console.log('PUT /orders/:Id', err.message);
            });
          });
        });
        it("PUT ".concat(PREFIX, "/orders/:Id - User Can Decrease Order Quantity"), function (done) {
          _user.default.findOne({
            where: {
              email: user1_Payload.email
            }
          }).then(function (user) {
            var id = user.id,
                name = user.name,
                email = user.email,
                phone = user.phone;

            var token = _jsonwebtoken.default.sign({
              user: {
                id: id,
                name: name,
                email: email,
                phone: phone
              }
            }, secret, {
              expiresIn: ONE_WEEK
            });

            _chai.default.request(_app.default).put("".concat(PREFIX, "/orders/").concat(orderItem.id)).set('Authorization', "Bearer ".concat(token)).send({
              action: 'decrease'
            }).then(function (res) {
              expect(res).to.have.status(200);
              assert.equal(res.body.status, 'success');
              done();
            }).catch(function (err) {
              return console.log('PUT /orders/:Id', err.message);
            });
          });
        });
        it("PUT ".concat(PREFIX, "/orders/:Id - User Can Delete Order)"), function (done) {
          _user.default.findOne({
            where: {
              email: user1_Payload.email
            }
          }).then(function (user) {
            var id = user.id,
                name = user.name,
                email = user.email,
                phone = user.phone;

            var token = _jsonwebtoken.default.sign({
              user: {
                id: id,
                name: name,
                email: email,
                phone: phone
              }
            }, secret, {
              expiresIn: ONE_WEEK
            });

            _chai.default.request(_app.default).put("".concat(PREFIX, "/orders/").concat(orderItem.id)).set('Authorization', "Bearer ".concat(token)).send({
              action: 'delete'
            }).then(function (res) {
              expect(res).to.have.status(200);
              assert.equal(res.body.status, 'success');
              done();
            }).catch(function (err) {
              return console.log('PUT /orders/:Id', err.message);
            });
          });
        });
      });
    }).catch(function (err) {
      return console.log(err.message);
    });
  });
  context('User Get Order Items (User)', function () {
    _admin.default.create(admin0_Payload).then(function (admin) {
      return _meals.default.create({
        name: 'meal',
        price: 500,
        quantity: 4,
        imageUrl: 'meal.png',
        adminId: admin.id
      });
    }).then(function (meal) {
      _user.default.create(user0_Payload).then(function (user) {
        return _orderItems.default.create({
          mealId: meal.id,
          quantity: 11,
          userId: user.id
        });
      }).then(function () {
        it("GET ".concat(PREFIX, "/orders/user - Fetch Order Items Unauthorized"), function (done) {
          _chai.default.request(_app.default).get("".concat(PREFIX, "/orders/user")).then(function (res) {
            expect(res).to.have.status(401);
            assert.equal(res.body.status, 'error');
            done();
          }).catch(function (err) {
            return console.log('GET /orders/user', err.message);
          });
        });
        it("GET ".concat(PREFIX, "/orders/user - Fetch Order Items *** User Authorized"), function (done) {
          _user.default.findOne({
            where: {
              email: user0_Payload.email
            }
          }).then(function (user) {
            var id = user.id,
                name = user.name,
                email = user.email,
                phone = user.phone;

            var token = _jsonwebtoken.default.sign({
              user: {
                id: id,
                name: name,
                email: email,
                phone: phone
              }
            }, secret, {
              expiresIn: ONE_WEEK
            });

            _chai.default.request(_app.default).get("".concat(PREFIX, "/orders/user")).set('Authorization', "Bearer ".concat(token)).then(function (res) {
              expect(res).to.have.status(200);
              assert.equal(res.body.status, 'success');
              done();
            }).catch(function (err) {
              return console.log('GET /orders/user', err.message);
            });
          });
        });
      });
    });
  });
  context('Checkout Orders (User)', function () {
    _admin.default.create(admin0_Payload).then(function (admin) {
      return _meals.default.create({
        name: 'meal',
        price: 600,
        quantity: 2,
        imageUrl: 'meal.png',
        adminId: admin.id
      });
    }).then(function (meal) {
      var newMenu = [];
      newMenu.push({
        id: meal.id,
        name: meal.name,
        price: meal.price,
        quantity: meal.quantity,
        imageUrl: meal.imageUrl,
        adminId: meal.adminId
      });
      return _menu.default.create({
        meals: JSON.stringify(newMenu),
        adminId: meal.adminId
      });
    }).then(function (menu) {
      _user.default.create(user1_Payload).then(function (user) {
        var meals = JSON.parse(menu.meals);
        return _orderItems.default.create({
          mealId: meals[0].id,
          quantity: 2,
          userId: user.id
        });
      }).then(function () {
        it("POST ".concat(PREFIX, "/orders/checkout - Order Checkout *** Unauthorized"), function (done) {
          _chai.default.request(_app.default).post("".concat(PREFIX, "/orders/checkout")).send({
            delivery_address: 'London'
          }).then(function (res) {
            expect(res).to.have.status(401);
            assert.equal(res.body.status, 'error');
            done();
          }).catch(function (err) {
            return console.log('POST /orders/checkout', err.message);
          });
        });
        it("POST ".concat(PREFIX, "/orders/checkout *** Checkout Validation Test"), function (done) {
          _user.default.findOne({
            where: {
              email: user1_Payload.email
            }
          }).then(function (user) {
            var id = user.id,
                name = user.name,
                email = user.email,
                phone = user.phone;

            var token = _jsonwebtoken.default.sign({
              user: {
                id: id,
                name: name,
                email: email,
                phone: phone
              }
            }, secret, {
              expiresIn: ONE_WEEK
            });

            _chai.default.request(_app.default).post("".concat(PREFIX, "/orders/checkout")).set('Authorization', "Bearer ".concat(token)).send({
              delivery_address: 8
            }).then(function (res) {
              expect(res).to.have.status(400);
              assert.equal(res.body.status, 'error');
              done();
            }).catch(function (err) {
              return console.log('POST /orders/checkout', err.message);
            });
          });
        });
        it("POST ".concat(PREFIX, "/orders/checkout *** User Can Not Checkout without order items)"), function (done) {
          _user.default.create(user0_Payload).then(function (user) {
            var id = user.id,
                name = user.name,
                email = user.email,
                phone = user.phone;

            var token = _jsonwebtoken.default.sign({
              user: {
                id: id,
                name: name,
                email: email,
                phone: phone
              }
            }, secret, {
              expiresIn: ONE_WEEK
            });

            _chai.default.request(_app.default).post("".concat(PREFIX, "/orders/checkout")).set('Authorization', "Bearer ".concat(token)).send({
              delivery_address: 'Festac'
            }).then(function (res) {
              expect(res).to.have.status(500);
              assert.equal(res.body.status, 'error');
              done();
            }).catch(function (err) {
              return console.log('POST /orders/checkout', err.message);
            });
          });
        });
        it("POST ".concat(PREFIX, "/orders/checkout *** User Can Checkout"), function (done) {
          _user.default.findOne({
            where: {
              email: user0_Payload.email
            }
          }).then(function (user) {
            var id = user.id,
                name = user.name,
                email = user.email,
                phone = user.phone;

            var token = _jsonwebtoken.default.sign({
              user: {
                id: id,
                name: name,
                email: email,
                phone: phone
              }
            }, secret, {
              expiresIn: ONE_WEEK
            });

            _chai.default.request(_app.default).post("".concat(PREFIX, "/orders/checkout")).set('Authorization', "Bearer ".concat(token)).send({
              delivery_address: 'Ilupeju'
            }).then(function (res) {
              expect(res).to.have.status(201);
              assert.equal(res.body.status, 'success');
              done();
            }).catch(function (err) {
              return console.log('POST /orders/checkout', err.message);
            });
          });
        });
      });
    }).catch(function (err) {
      return console.log(err.message);
    });
  });
});
after(function (done) {
  _user.default.destroy({
    where: {
      email: user0_Payload.email
    }
  }).then(
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _admin.default.destroy({
              where: {
                email: admin0_Payload.email
              }
            });

          case 2:
            _context.next = 4;
            return _admin.default.destroy({
              where: {
                email: admin1_Payload.email
              }
            });

          case 4:
            _context.next = 6;
            return _user.default.destroy({
              where: {
                email: user1_Payload.email
              }
            });

          case 6:
            _context.next = 8;
            return _user.default.destroy({
              where: {
                email: user0_Payload.email
              }
            });

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }))).then(function () {
    done();
  });
});
//# sourceMappingURL=orders_test.js.map