"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../src/app"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = require("dotenv");

var _user = _interopRequireDefault(require("../src/models/user"));

var _admin = _interopRequireDefault(require("../src/models/admin"));

var _meals = _interopRequireDefault(require("../src/models/meals"));

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
  name: 'steve burma',
  email: 'burma@gmail.com',
  phone: '09078909098',
  password: 'steve12345'
};
var user1_Payload = {
  name: 'steve Joe',
  email: 'steve@gmail.com',
  phone: '09078909098',
  password: 'steve12345'
};
var admin0_Payload = {
  name: 'andrei burma',
  email: 'andrei@gmail.com',
  phone: '07060538862',
  password: 'andrei12345'
};
var admin1_Payload = {
  name: 'cliff burma',
  email: 'cliff@gmail.com',
  phone: '09057996214',
  password: 'cliff12345'
};
before(function (done) {
  _user.default.create(user0_Payload).then(function () {
    return _admin.default.create(admin0_Payload);
  }).then(function () {
    done();
  });
});
describe('Menu Endpoints', function () {
  context('Get all Menus (User)', function () {
    it("GET ".concat(PREFIX, "/menu/ - Fetch All Menus (Unauthorized)"), function (done) {
      _chai.default.request(_app.default).get("".concat(PREFIX, "/menu/")).then(function (res) {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      }).catch(function (err) {
        return console.log('GET /menu/', err.message);
      });
    });
    it("GET ".concat(PREFIX, "/menu/ - Fetch All Menus - (User Authorized)"), function (done) {
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

        _chai.default.request(_app.default).get("".concat(PREFIX, "/menu/")).set('Authorization', "Bearer ".concat(token)).then(function (res) {
          expect(res).to.have.status(200);
          assert.equal(res.body.status, 'success');
          done();
        }).catch(function (err) {
          return console.log('GET /menu/', err.message);
        });
      });
    });
  });
  context("Get Admin's own Menu (Admin)", function () {
    it("GET ".concat(PREFIX, "/menu/admin -Admin can not Fetch Menu (Unauthorized)"), function (done) {
      _chai.default.request(_app.default).get("".concat(PREFIX, "/menu/admin")).then(function (res) {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      }).catch(function (err) {
        return console.log('GET /menu/admin', err.message);
      });
    });
    it("GET ".concat(PREFIX, "/menu/admin - Admin can Fetch Menu - (Authorized)"), function (done) {
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

        _chai.default.request(_app.default).get("".concat(PREFIX, "/menu/admin")).set('Authorization', "Bearer ".concat(token)).then(function (res) {
          expect(res).to.have.status(200);
          assert.equal(res.body.status, 'success');
          done();
        }).catch(function (err) {
          return console.log('GET /menu/admin', err.message);
        });
      });
    });
  });
  context('Admin can Add Meal To Menu', function () {
    _admin.default.create(admin1_Payload).then(function (admin) {
      return _meals.default.create({
        name: 'Food one',
        price: 700,
        imageUrl: 'food.png',
        AdminId: admin.id
      });
    }).then(function (meal) {
      var Id = meal.id;
      it("POST ".concat(PREFIX, "/menu/ - Add Meal Option To Menu(Unauthorized)"), function (done) {
        _chai.default.request(_app.default).post("".concat(PREFIX, "/menu/")).send({
          Id: Id,
          quantity: 2
        }).then(function (res) {
          expect(res).to.have.status(401);
          assert.equal(res.body.status, 'error');
          done();
        }).catch(function (err) {
          return console.log('POST /menu/', err.message);
        });
      });
      it("POST ".concat(PREFIX, "/menu/ - Admin can Add Meal Option To Menu - (Validation Test)"), function (done) {
        _admin.default.findOne({
          where: {
            email: admin1_Payload.email
          }
        }).then(function (admin) {
          var token = _jsonwebtoken.default.sign({
            admin: {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              phone: admin.phone
            },
            isAdmin: true
          }, secret, {
            expiresIn: ONE_WEEK
          });

          _chai.default.request(_app.default).post("".concat(PREFIX, "/menu/")).set('Authorization', "Bearer ".concat(token)).send({
            Id: Id
          }).then(function (res) {
            expect(res).to.have.status(400);
            assert.equal(res.body.status, 'error');
            done();
          }).catch(function (err) {
            return console.log('POST /menu/', err.message);
          });
        });
      });
      it("POST ".concat(PREFIX, "/menu/ -Can not Add Meal Option To Menu when Meal ID does not exist)"), function (done) {
        _admin.default.findOne({
          where: {
            email: admin1_Payload.email
          }
        }).then(function (admin) {
          var token = _jsonwebtoken.default.sign({
            admin: {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              phone: admin.phone
            },
            isAdmin: true
          }, secret, {
            expiresIn: ONE_WEEK
          });

          _chai.default.request(_app.default).post("".concat(PREFIX, "/menu/")).set('Authorization', "Bearer ".concat(token)).send({
            mealId: 890000000,
            quantity: 10
          }).then(function (res) {
            expect(res).to.have.status(500);
            assert.equal(res.body.status, 'error');
            done();
          }).catch(function (err) {
            return console.log('POST /menu/', err.message);
          });
        });
      });
      it("POST ".concat(API_PREFIX, "/menu/ -Admin can Add Meal Option To Menu -)"), function (done) {
        _admin.default.findOne({
          where: {
            email: admin1_Payload.email
          }
        }).then(function (admin) {
          var token = _jsonwebtoken.default.sign({
            admin: {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              phone: admin.phone
            },
            isAdmin: true
          }, secret, {
            expiresIn: ONE_WEEK
          });

          _chai.default.request(_app.default).post("".concat(PREFIX, "/menu/")).set('Authorization', "Bearer ".concat(token)).send({
            Id: Id,
            quantity: 5
          }).then(function (res) {
            expect(res).to.have.status(200);
            assert.equal(res.body.status, 'success');
            done();
          }).catch(function (err) {
            return console.log('POST /menu/', err.message);
          });
        }).catch(function (err) {
          return console.log(err.message);
        });
      });
      it("POST ".concat(PREFIX, "/menu/ -UPADATE Meal Option To Menu)"), function (done) {
        _admin.default.findOne({
          where: {
            email: admin1_Payload.email
          }
        }).then(function (admin) {
          var token = _jsonwebtoken.default.sign({
            admin: {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              phone: admin.phone
            },
            isAdmin: true
          }, secret, {
            expiresIn: ONE_WEEK
          });

          _chai.default.request(_app.default).post("".concat(PREFIX, "/menu/")).set('Authorization', "Bearer ".concat(token)).send({
            Id: Id,
            quantity: 5
          }).then(function (res) {
            expect(res).to.have.status(200);
            assert.equal(res.body.status, 'success');
            assert.equal(res.body.data[0].quantity, 2);

            _meals.default.destroy({
              where: {
                id: Id
              }
            }).then(function () {
              done();
            });
          }).catch(function (err) {
            return console.log('POST /menu/', err.message);
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
            return _context.abrupt("return", _admin.default.destroy({
              where: {
                email: admin1_Payload.email
              }
            }));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }))).then(function () {
    done();
  });
});
//# sourceMappingURL=menu_test.js.map