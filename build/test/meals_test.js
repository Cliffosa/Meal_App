"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../src/app"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _jwt = _interopRequireDefault(require("../src/util/jwt"));

var _admin = _interopRequireDefault(require("../src/models/admin"));

var _meals = _interopRequireDefault(require("../src/models/meals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

process.env.NODE_ENV = 'test';
var assert = _chai.default.assert,
    expect = _chai.default.expect;

_chai.default.use(_chaiHttp.default); // const srcImg = '../testImage/3.jpg';
// const imageFolder = '../src/images';


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
  _admin.default.create(admin1_Payload).then(function () {
    done();
  });
});
describe('Amin Get all Meals', function () {
  it("GET /api/v1/meals/ - Fetch All Meals Unauthorized", function (done) {
    _chai.default.request(_app.default).get("/api/v1/meals/").then(function (res) {
      expect(res).to.have.status(401);
      assert.equal(res.body.status, 'error');
      done();
    }).catch(function (err) {
      return console.log('GET /meals/', err.message);
    });
  });
  it("GET /api/v1/meals/ - Fetch All Meals - (Admin Authorized)", function (done) {
    _admin.default.findOne({
      where: {
        email: admin1_Payload.email
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
        expiresIn: 86400
      });

      _chai.default.request(_app.default).get("/api/v1/meals/").set('Authorization', "Bearer ".concat(token)).then(function (res) {
        expect(res).to.have.status(200);
        assert.equal(res.body.status, 'success');
        done();
      }).catch(function (err) {
        return console.log('GET /meals/', err.message);
      });
    }).catch(function (err) {
      return console.log(err.message);
    });
  });
});
describe('Admin Add Meal ', function () {
  it("POST /api/v1/meals/ - Add Meal Unauthorized", function (done) {
    _chai.default.request(_app.default).post("/api/v1/meals/").send({
      name: 'Koko Garri',
      price: 500
    }).then(function (res) {
      expect(res).to.have.status(401);
      assert.equal(res.body.status, 'error');
      done();
    }).catch(function (err) {
      return console.log('POST /meals/', err.message);
    });
  });
  it("POST /api/v1/meals/ - Add Meal Option - Validate", function (done) {
    _admin.default.findOne({
      where: {
        email: admin0_Payload.email
      }
    }).then(function (admin) {
      var token = _jsonwebtoken.default.sign({
        caterer: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone
        },
        isAdmin: true
      }, _jwt.default, {
        expiresIn: '1h'
      });

      _chai.default.request(_app.default).post("/api/v1/meals/").set('Authorization', "Bearer ".concat(token)).send({
        name: 'koko Garri',
        price: 500
      }).then(function (res) {
        expect(res).to.have.status(400);
        assert.equal(res.body.status, 'error');
        done();
      }).catch(function (err) {
        return console.log('POST /meals/', err.message);
      });
    }).catch(function (err) {
      return console.log(err.message);
    });
  });
  it("POST /api/v1/meals/ - Add Meal  - Admin Can Add Meal Option", function (done) {
    _admin.default.findOne({
      where: {
        email: admin0_Payload.email
      }
    }).then(function (admin) {
      var token = _jsonwebtoken.default.sign({
        caterer: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone
        },
        isAdmin: true
      }, _jwt.default, {
        expiresIn: '1h'
      });

      _chai.default.request(_app.default).post("/api/v1/meals/").set('Authorization', "Bearer ".concat(token)).field('name', 'fufu').field('price', 500).field('quantity', 'small').attach('image', '../testImages/3.png', '3.png').then(function (res) {
        expect(res).to.have.status(200);
        assert.equal(res.body.status, 'success');
        done();
      }).catch(function (err) {
        return console.log('POST /meals/', err.message);
      });
    }).catch(function (err) {
      return console.log(err.message);
    });
  });
});
describe('Admin Can Modify Meal', function () {
  _admin.default.create(admin1_Payload).then(function (admin) {
    return _meals.default.create({
      name: 'rice',
      price: 1000,
      quantity: 3,
      adminId: admin.id
    });
  }).then(function (meal) {
    it("PUT /api/v1/meals/:Id - Modify Meal Option Unauthorized", function (done) {
      _chai.default.request(_app.default).put("/api/v1/meals/".concat(meal.id)).send({
        name: 'beans',
        price: 600
      }).then(function (res) {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      }).catch(function (err) {
        return console.log('PUT /meals/:Id', err.message);
      });
    });
    it("PUT /api/v1/meals/:Id - Modify Meal Option = Validate", function (done) {
      _admin.default.findOne({
        where: {
          email: admin1_Payload.email
        }
      }).then(function (admin) {
        var token = _jsonwebtoken.default.sign({
          caterer: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone
          },
          isAdmin: true
        }, _jwt.default, {
          expiresIn: '1h'
        });

        _chai.default.request(_app.default).put("/api/v1/meals/".concat(meal.id)).set('Authorization', "Bearer ".concat(token)).send({
          name: 'stew'
        }).then(function (res) {
          expect(res).to.have.status(400);
          assert.equal(res.body.status, 'error');
          done();
        }).catch(function (err) {
          return console.log('POST /meals/:Id', err.message);
        });
      }).catch(function (err) {
        return console.log(err.message);
      });
    });
    it("PUT /api/v1/meals/:Id - Modify Meal Option Admin Can Modify Meal Option", function (done) {
      _admin.default.findOne({
        where: {
          email: admin1_Payload.email
        }
      }).then(function (admin) {
        var token = _jsonwebtoken.default.sign({
          caterer: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone
          },
          isAdmin: true
        }, _jwt.default, {
          expiresIn: 86400
        });

        _chai.default.request(_app.default).put("/api/v1/meals/".concat(meal.id)).set('Authorization', "Bearer ".concat(token)).field('name', 'meal').field('price', 200).attach('image', '../testImage/3.jpg', '3.jpg').then(function (res) {
          expect(res).to.have.status(200);
          assert.equal(res.body.status, 'success');

          _fs.default.unlink('../src/images/3.jpg', function (err) {
            if (err) console.log(err.message);
          });

          _meals.default.destroy({
            where: {
              id: meal.id
            }
          }).then(function () {
            done();
          });
        }).catch(function (err) {
          return console.log('POST /meals/:Id', err.message);
        });
      }).catch(function (err) {
        return console.log(err.message);
      });
    });
  });
});
describe('Admin Can Delete Meal', function () {
  _admin.default.create(admin1_Payload).then(function (admin) {
    return _meals.default.create({
      name: 'rice',
      price: 1000,
      quantity: 3,
      adminId: admin.id
    });
  }).then(function (meal) {
    it("/api/v1/meals/:Id - Delete Meal (Unauthorized)", function (done) {
      _chai.default.request(_app.default).delete("/api/v1/meals/".concat(meal.id)).then(function (res) {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      }).catch(function (err) {
        return console.log('DELETE /meals/:Id', err.message);
      });
    });
    it("DELETE /api/v1/meals/:Id - Delete Meal - Authorized", function (done) {
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
          caterer: {
            id: id,
            name: name,
            email: email,
            phone: phone
          },
          isAdmin: true
        }, _jwt.default, {
          expiresIn: '1h'
        });

        _chai.default.request(_app.default).delete("/api/v1/meals/".concat(meal.id)).set('Authorization', "Bearer ".concat(token)).then(function (res) {
          expect(res).to.have.status(200);
          assert.equal(res.body.status, 'success');
          done();
        }).catch(function (err) {
          return console.log('DELETE /meals/:Id', err.message);
        });
      }).catch(function (err) {
        return console.log(err.message);
      });
    });
  });
});
after(function (done) {
  _admin.default.destroy({
    where: {
      email: admin0_Payload.email
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
                email: admin1_Payload.email
              }
            });

          case 2:
            return _context.abrupt("return", _admin.default.destroy({
              where: {
                email: admin0_Payload.email
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
//# sourceMappingURL=meals_test.js.map