"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../src/app"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _admin = _interopRequireDefault(require("../src/models/admin"));

var _meals = _interopRequireDefault(require("../src/models/meals"));

var _user = _interopRequireDefault(require("../src/models/user"));

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
var srcImg = '../testImage/3.jpg';
var imageFolder = '../src/images';

var duplicateImage = function duplicateImage() {
  var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '3.png';
  return new Promise(function (resolve, reject) {
    _fs.default.access(imageFolder, function (err) {
      var readStream = _fs.default.createReadStream(srcImg);

      readStream.once('error', function (error) {
        reject(error.message);
      });
      readStream.pipe(_fs.default.createWriteStream(_path.default.join(imageFolder, filename)));
      if (err) reject(err.message);
    });

    resolve(true);
  });
};

var user0_Payload = {
  name: 'user user',
  phone: '07060538862',
  email: 'user@gmail.com',
  password: 'user123456'
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
  _admin.default.create(admin1_Payload).then(function () {
    done();
  });
});
describe('Meals Endpoints', function () {
  context('Admin Get all Meals ', function () {
    it("GET ".concat(PREFIX, "/meals/ - Fetch All Meals Unauthorized"), function (done) {
      _chai.default.request(_app.default).get("".concat(PREFIX, "/meals/")).then(function (res) {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      }).catch(function (err) {
        return console.log('GET /meals/', err.message);
      });
    });
    it("GET ".concat(PREFIX, "/meals/ - Fetch All Meals (User Unauthorized)"), function (done) {
      _user.default.findOne({
        where: {
          email: userPayload.email
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

        _chai.default.request(_app.default).get("".concat(PREFIX, "/meals/")).set('Authorization', "Bearer ".concat(token)).then(function (res) {
          expect(res).to.have.status(401);
          assert.equal(res.body.status, 'error');
          done();
        }).catch(function (err) {
          return console.log('GET /meals/', err.message);
        });
      }).catch(function (err) {
        return console.log(err.message);
      });
    });
    it("GET ".concat(PREFIX, "/meals/ - Fetch All Meals - Admin Authorized)"), function (done) {
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
        }, secret, {
          expiresIn: ONE_WEEK
        });

        _chai.default.request(_app.default).get("".concat(PREFIX, "/meals/")).set('Authorization', "Bearer ".concat(token)).then(function (res) {
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
  context('Admin Add Meal Option )', function () {
    it("POST ".concat(PREFIX, "/meals/ - Add Meal Option (Unauthorized)"), function (done) {
      _chai.default.request(_app.default).post("".concat(PREFIX, "/meals/")).send({
        name: 'meal',
        price: '500'
      }).then(function (res) {
        expect(res).to.have.status(401);
        assert.equal(res.body.status, 'error');
        done();
      }).catch(function (err) {
        return console.log('POST /meals/', err.message);
      });
    });
    it("POST ".concat(PREFIX, "/meals/ - Add Meal Option *** Validation Test"), function (done) {
      _admin.default.findOne({
        where: {
          email: admin0_Payload.email
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

        _chai.default.request(_app.default).post("".concat(PREFIX, "/meals/")).set('Authorization', "Bearer ".concat(token)).send({
          name: 'meal',
          price: '500'
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
    it("POST ".concat(PREFIX, "/meals/ - Add Meal Option "), function (done) {
      _admin.default.findOne({
        where: {
          email: Admin0_Payload.email
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

        _chai.default.request(_app.default).post("".concat(PREFIX, "/meals/")).set('Authorization', "Bearer ".concat(token)).field('name', 'meal').field('price', '3000').attach('image', '../testImages/3.jpg', '3.jpg').then(function (res) {
          expect(res).to.have.status(201);
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
  context('Modify Meal Option ', function () {
    duplicateImage().then(function () {
      _admin.default.create(admin0_Payload).then(function (admin) {
        return _meals.default.create({
          name: 'fufu',
          price: 100,
          imageUrl: '../src/images/3.jpg',
          mealId: admin.id
        }).then(function (meal) {
          it("PUT ".concat(PREFIX, "/meals/:Id - Modify Meal Option (Unauthorized)"), function (done) {
            _chai.default.request(_app.default).put("".concat(PREFIX, "/meals/").concat(meal.id)).send({
              name: 'meal meal',
              price: 300
            }).then(function (res) {
              expect(res).to.have.status(401);
              assert.equal(res.body.status, 'error');
              done();
            }).catch(function (err) {
              return console.log('PUT /meals/:mealId', err.message);
            });
          });
          it("PUT ".concat(PREFIX, "/meals/:mealId - Modify Meal Option Validate"), function (done) {
            _admin.default.findOne({
              where: {
                email: admin0_Payload.email
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

              _chai.default.request(_app.default).put("".concat(PREFIX, "/meals/").concat(meal.id)).set('Authorization', "Bearer ".concat(token)).send({
                name: 300
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
          it("PUT ".concat(PREFIX, "/meals/:Id - Modify Meal Option - (Admin)"), function (done) {
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
              }, secret, {
                expiresIn: ONE_WEEK
              });

              _chai.default.request(_app.default).put("".concat(PREFIX, "/meals/").concat(meal.id)).set('Authorization', "Bearer ".concat(token)).field('name', 'meal meal').field('price', '400').attach('image', '../testImage/3.jpg', '3.jpg').then(function (res) {
                expect(res).to.have.status(200);
                assert.equal(res.body.status, 'success');

                _fs.default.unlink('../src/images/2.jpg', function (err) {
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
                return console.log('POST /meals/', err.message);
              });
            }).catch(function (err) {
              return console.log(err.message);
            });
          });
        });
      });
    }).catch(function (err) {
      return console.log(err.message);
    });
  });
  context('Admin Delete Meal Option ', function () {
    duplicateImage('fake2.png').then(function () {
      _admin.default.create(admin1_Payload).then(function (admin) {
        return _meals.default.create({
          name: 'meal',
          price: 550,
          imageUrl: '../src/images/2.jpg',
          adminId: admin.id
        });
      }).then(function (meal) {
        it("DELETE ".concat(PREFIX, "/meals/:Id - Delete Meal *** Unauthorized"), function (done) {
          _chai.default.request(_app.default).delete("".concat(PREFIX, "/meals/").concat(meal.id)).then(function (res) {
            expect(res).to.have.status(401);
            assert.equal(res.body.status, 'error');
            done();
          }).catch(function (err) {
            return console.log('DELETE /meals/:Id', err.message);
          });
        });
        it("DELETE ".concat(PREFIX, "/meals/:Id - Delete Meal *** Authorized)"), function (done) {
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

            _chai.default.request(_app.default).delete("".concat(PREFIX, "/meals/").concat(meal.id)).set('Authorization', "Bearer ".concat(token)).then(function (res) {
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
    }).catch(function (err) {
      return console.log(err.message);
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
            _context.next = 4;
            return _admin.default.destroy({
              where: {
                email: admin0_Payload.email
              }
            });

          case 4:
            return _context.abrupt("return", _user.default.destroy({
              where: {
                email: user0_Payload.email
              }
            }));

          case 5:
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