"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../src/app"));

var _user = _interopRequireDefault(require("../src/models/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = 'test';
var assert = _chai.default.assert,
    expect = _chai.default.expect;

_chai.default.use(_chaiHttp.default);

var login_details = {
  email: "ford@gmail.com",
  password: "123@abc"
}; // let register_details = {
//   name: `Rexford`,
//   email: `ford@gmail.com`,
//   phone: `07060538862`,
//   password: `123@abc`
// };

before(function (done) {
  done();
});
describe('User Auth Signup Endpoint Tests', function () {
  it('POST /auth/signup - User Can Sign Up', function (done) {
    _chai.default.request(_app.default).post("/api/v1/auth/signup").send({
      name: "Rexford",
      email: "ford@gmail.com",
      phone: "07060538862",
      password: "123@abc"
    }).then(function (res) {
      expect(res).to.have.status(201);
      assert.equal(res.body.status, 'success');
      done();
    }).catch(function (err) {
      return console.log('POST /auth/signup', err.message);
    });
  });
  it("POST /auth/signup - User Can't signup again with the same email", function (done) {
    _chai.default.request(_app.default).post("/api/v1/auth/signup").send({
      name: "Rexford",
      email: "ford@gmail.com",
      phone: "07060538862",
      password: "123@abc"
    }).then(function (res) {
      expect(res).to.have.status(500);
      assert.equal(res.body.status, 'error');
      done();
    }).catch(function (err) {
      return console.log('POST /auth/signup', err.message);
    });
  });
});
describe('User Auth Login Endpoint Tests', function () {
  it('POST /auth/login - User Cannot Login without being registered', function (done) {
    _chai.default.request(_app.default).post("/api/v1/auth/login").send({
      login_details: login_details
    }).then(function (res) {
      expect(res).to.have.status(500);
      assert.equal(res.body.status, 'error');
      done();
    }).catch(function (err) {
      return console.log('POST /auth/login', err.message);
    });
  });
  it('POST /auth/login - User Can Login', function (done) {
    _chai.default.request(_app.default).post("/api/v1/auth/login").send({
      login_details: login_details
    }).then(function (res) {
      expect(res).to.have.status(200);
      assert.equal(res.body.status, 'success');
      done();
    }).catch(function (err) {
      return console.log('POST /auth/login', err.message);
    });
  });
  it("POST /auth/login - User Can't login with incorrect password", function (done) {
    _chai.default.request(_app.default).post("/api/v1/auth/login").send({
      email: 'ford@gmail.com',
      password: 'password111'
    }).then(function (res) {
      expect(res).to.have.status(500);
      assert.equal(res.body.status, 'error');
      done();
    }).catch(function (err) {
      return console.log('POST /auth/login', err.message);
    });
  });
});
after(function (done) {
  _user.default.destroy({
    where: {
      email: 'roger@test.com'
    }
  }).then(function () {
    done();
  });
});
//# sourceMappingURL=user_test.js.map