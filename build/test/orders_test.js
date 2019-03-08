"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../src/app"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _jwt = _interopRequireDefault(require("../src/util/jwt"));

var _user = _interopRequireDefault(require("../src/models/user"));

var _admin = _interopRequireDefault(require("../src/models/admin"));

var _menu = _interopRequireDefault(require("../src/models/menu"));

var _meals = _interopRequireDefault(require("../src/models/meals"));

var _orderItems = _interopRequireDefault(require("../src/models/orderItems"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

process.env.NODE_ENV = 'test';
var assert = _chai.default.assert,
    expect = _chai.default.expect;

_chai.default.use(_chaiHttp.default);

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
describe('Admin Get all Orders Endpoint ', function () {
  it("GET /api/v1/orders - Fetch All Orders (Unauthorized)", function (done) {
    _chai.default.request(_app.default).get("/api/v1/orders").then(function (res) {
      expect(res).to.have.status(401);
      assert.equal(res.body.status, 'error');
      done();
    }).catch(function (err) {
      return console.log('GET /orders', err.message);
    });
  });
  it("GET /apii/v1/orders - Fetch All Orders - Authorized", function (done) {
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
      }, _jwt.default, {
        expiresIn: '2h'
      });

      _chai.default.request(_app.default).get("api/v1/orders").set('Authorization', "Bearer ".concat(token)).then(function (res) {
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
describe('User can add to Orders Endpoint ', function () {
  _admin.default.create(admin0_Payload).then(function (admin) {
    return _meals.default.create({
      name: 'fried Meat',
      price: 1500,
      imageUrl: 'meat.png',
      adminId: admin.id
    });
  }).then(function (meal) {
    it("POST /api/v1/orders - Add To Orders (Unauthorized)", function (done) {
      _chai.default.request(_app.default).post("/api/v1/orders").send({
        mealId: meal.id,
        quantity: 1
      }).then(function (res) {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      }).catch(function (err) {
        return console.log('POST /orders', err.message);
      });
    });
    it("POST /api/v1/orders - Add To Orders == Validation Test", function (done) {
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
        }, _jwt.default, {
          expiresIn: '1h'
        });

        _chai.default.request(_app.default).post("/api/v1/orders").set('Authorization', "Bearer ".concat(token)).send({
          mealId: meal.id
        }).then(function (res) {
          expect(res).to.have.status(400);
          assert.equal(res.body.status, 'error');
          done();
        }).catch(function (err) {
          return console.log('POST /orders', err.message);
        });
      });
    });
    it("POST /api/v1/orders - Add To Orders - (User can Add to Order)", function (done) {
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
        }, _jwt.default, {
          expiresIn: '2h'
        });

        _chai.default.request(_app.default).post("/api/v1/orders").set('Authorization', "Bearer ".concat(token)).send({
          mealId: meal.id,
          quantity: 'small'
        }).then(function (res) {
          expect(res).to.have.status(200);
          assert.equal(res.body.status, 'success');
          done();
        }).catch(function (err) {
          return console.log('POST /orders', err.message);
        });
      });
    });
  }).catch(function (err) {
    return console.log(err.message);
  });
});
describe('User can Modify Orders Endpoints', function () {
  Caterer.create(caterer3Payload).then(function (caterer) {
    return _meals.default.create({
      name: 'Dummy Meal',
      price: 500,
      quantity: 4,
      imageUrl: 'fk.png',
      catererId: caterer.id
    });
  }).then(function (meal) {
    _user.default.create(user2Payload).then(function (user) {
      return _orderItems.default.create({
        mealId: meal.id,
        quantity: 3,
        userId: user.id
      });
    }).then(function (orderItem) {
      it("PUT ".concat(API_PREFIX, "/orders/:orderId - Modify Orders (Unauthorized)"), function (done) {
        _chai.default.request(app).put("".concat(API_PREFIX, "/orders/").concat(orderItem.id)).send({
          action: 'increase'
        }).then(function (res) {
          expect(res).to.have.status(401);
          assert.equal(res.body.status, 'error');
          done();
        }).catch(function (err) {
          return console.log('PUT /orders/:orderId', err.message);
        });
      });
      it("PUT ".concat(API_PREFIX, "/orders/:orderId - Modify Orders (Validation Test)"), function (done) {
        _user.default.findOne({
          where: {
            email: user2Payload.email
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
          }, _jwt.default, {
            expiresIn: 86400
          });

          _chai.default.request(app).put("".concat(API_PREFIX, "/orders/").concat(orderItem.id)).set('Authorization', "Bearer ".concat(token)).send({
            action: 'something'
          }).then(function (res) {
            expect(res).to.have.status(400);
            assert.equal(res.body.status, 'error');
            done();
          }).catch(function (err) {
            return console.log('PUT /orders/:orderId', err.message);
          });
        });
      });
      it("PUT ".concat(API_PREFIX, "/orders/:orderId - Modify Orders (User Can Increase Order Quantity)"), function (done) {
        _user.default.findOne({
          where: {
            email: user2Payload.email
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
          }, _jwt.default, {
            expiresIn: 86400
          });

          _chai.default.request(app).put("".concat(API_PREFIX, "/orders/").concat(orderItem.id)).set('Authorization', "Bearer ".concat(token)).send({
            action: 'increase'
          }).then(function (res) {
            expect(res).to.have.status(200);
            assert.equal(res.body.status, 'success');
            done();
          }).catch(function (err) {
            return console.log('PUT /orders/:orderId', err.message);
          });
        });
      });
      it("PUT ".concat(API_PREFIX, "/orders/:orderId - Modify Orders (User Can Decrease Order Quantity)"), function (done) {
        _user.default.findOne({
          where: {
            email: user2Payload.email
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
          }, _jwt.default, {
            expiresIn: 86400
          });

          _chai.default.request(app).put("".concat(API_PREFIX, "/orders/").concat(orderItem.id)).set('Authorization', "Bearer ".concat(token)).send({
            action: 'decrease'
          }).then(function (res) {
            expect(res).to.have.status(200);
            assert.equal(res.body.status, 'success');
            done();
          }).catch(function (err) {
            return console.log('PUT /orders/:orderId', err.message);
          });
        });
      });
      it("PUT ".concat(API_PREFIX, "/orders/:orderId - Modify Orders (User Can Delete Order)"), function (done) {
        _user.default.findOne({
          where: {
            email: user2Payload.email
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
          }, _jwt.default, {
            expiresIn: 86400
          });

          _chai.default.request(app).put("".concat(API_PREFIX, "/orders/").concat(orderItem.id)).set('Authorization', "Bearer ".concat(token)).send({
            action: 'delete'
          }).then(function (res) {
            expect(res).to.have.status(200);
            assert.equal(res.body.status, 'success');
            done();
          }).catch(function (err) {
            return console.log('PUT /orders/:orderId', err.message);
          });
        });
      });
    });
  }).catch(function (err) {
    return console.log(err.message);
  });
});
describe('Admin Can Get their Menu Endpoint ', function () {
  _admin.default.create(admin1_Payload).then(function (admin) {
    return _meals.default.create({
      name: 'shawama',
      price: 2000,
      quantity: 'large',
      imageUrl: 'shawama.png',
      adminId: admin.id
    });
  }).then(function (meal) {
    _user.default.create(user0_Payload).then(function (user) {
      return _orderItems.default.create({
        mealId: meal.id,
        quantity: 'medium',
        userId: user.id
      });
    }).then(function () {
      it("GET /api/v1/orders/user - Fetch Order Items (Unauthorized)", function (done) {
        _chai.default.request(_app.default).get("/api/v1/orders/user").then(function (res) {
          expect(res).to.have.status(401);
          assert.equal(res.body.status, 'error');
          done();
        }).catch(function (err) {
          return console.log('GET /orders/user', err.message);
        });
      });
      it("GET /api/v1/orders/user - Fetch Order Items - (User Authorized)", function (done) {
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
          }, _jwt.default, {
            expiresIn: '1h'
          });

          _chai.default.request(_app.default).get("/api/v1/orders/user").set('Authorization', "Bearer ".concat(token)).then(function (res) {
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
describe('User can Checkout Orders Endpoint ', function () {
  _admin.default.create(admin0_Payload).then(function (admin) {
    return _meals.default.create({
      name: 'fried rice',
      price: 2000,
      quantity: 'large',
      imageUrl: 'rice.png',
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
    _user.default.create(user0_Payload).then(function (user) {
      var meals = JSON.parse(menu.meals);
      return _orderItems.default.create({
        mealId: meals[0].id,
        quantity: 'small',
        userId: user.id
      });
    }).then(function () {
      it("POST /api/v1/orders/checkout - Order Checkout (Unauthorized)", function (done) {
        _chai.default.request(_app.default).post("/api/v1/orders/checkout").send({
          delivery_address: 'festac lagos'
        }).then(function (res) {
          expect(res).to.have.status(401);
          assert.equal(res.body.status, 'error');
          done();
        }).catch(function (err) {
          return console.log('POST /orders/checkout', err.message);
        });
      });
      it("POST /api/v1/orders/checkout - Order Checkout (Validation Test)", function (done) {
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
          }, _jwt.default, {
            expiresIn: '1h'
          });

          _chai.default.request(_app.default).post("/api/v1/orders/checkout").set('Authorization', "Bearer ".concat(token)).send({
            delivery_address: 'satellite lagos'
          }).then(function (res) {
            expect(res).to.have.status(400);
            assert.equal(res.body.status, 'error');
            done();
          }).catch(function (err) {
            return console.log('POST /orders/checkout', err.message);
          });
        });
      });
      it("POST /api/v1/orders/checkout - Order Checkout (User Can Checkout)", function (done) {
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
          }, _jwt.default, {
            expiresIn: '2h'
          });

          _chai.default.request(_app.default).post("/api/v1/orders/checkout").set('Authorization', "Bearer ".concat(token)).send({
            delivery_address: 'Okota Lagos'
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