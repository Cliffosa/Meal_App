"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../src/app"));

var _admin = _interopRequireDefault(require("../src/models/admin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = 'test';
var assert = _chai.default.assert,
    expect = _chai.default.expect;

_chai.default.use(_chaiHttp.default);

var PREFIX = '/api/v1';
var login_details = {
  email: "admin@gmail.com",
  password: "123@abc"
};
var register_details = {
  name: "Admin",
  email: "admin@gmail.com",
  phone: "07060538862",
  password: "123@abc"
};
beforeEach(function (done) {
  done();
});
describe('Admin Auth Signup Tests', function () {
  it('POST /auth/admin/signup - Admin Can Sign Up', function (done) {
    _chai.default.request(_app.default).post("".concat(PREFIX, "/auth/admin/signup")).send({
      register_details: register_details
    }).then(function (res) {
      expect(res).to.have.status(201);
      expect(res.body).to.have.status('success');
      expect(res.body).to.be.a('object');
      expect(res).to.be.json;
      done();
    }).catch(function (err) {
      return console.log('POST /auth/admin/signup', err.message);
    });
  });
  it("POST /auth/admin/signup - Admin Can't signup again with the same email", function (done) {
    _chai.default.request(_app.default).post("".concat(PREFIX, "/auth/admin/signup")).send({
      register_details: register_details
    }).then(function (res) {
      expect(res).to.have.status(500);
      assert.equal(res.body).status('error');
      done();
    }).catch(function (err) {
      return console.log('POST /auth/admin/signup', err.message);
    });
  });
});
describe('Admin Can Login Endpoint Tests', function () {
  it('POST /auth/admin/login - Admin Cannot Login without first registered', function (done) {
    _chai.default.request(_app.default).post("".concat(PREFIX, "/auth/admin/login")).send({
      login_details: login_details
    }).then(function (res) {
      expect(res).to.have.status(500);
      assert.equal(res.body.status, 'error');
      done();
    }).catch(function (err) {
      return console.log('POST /auth/admin/login', err.message);
    });
  });
  it('POST /auth/admin/login - Admin Can Login', function (done) {
    _chai.default.request(_app.default).post("".concat(PREFIX, "/auth/admin/login")).send({
      login_details: login_details
    }).then(function (res) {
      expect(res).to.have.status(200);
      assert.equal(res.body.status, 'success');
      done();
    }).catch(function (err) {
      return console.log('POST /auth/admin/login', err.message);
    });
  });
  it("POST /auth/admin/login - Admin Can't login with invalid password", function (done) {
    _chai.default.request(_app.default).post("".concat(PREFIX, "/auth/admin/login")).send({
      email: 'admin@gmail.com',
      password: 'password111'
    }).then(function (res) {
      expect(res).to.have.status(500);
      assert.equal(res.body.status, 'error');
      done();
    }).catch(function (err) {
      return console.log('POST /auth/admin/login', err.message);
    });
  });
});
after(function (done) {
  _admin.default.destroy({
    where: {
      email: 'admin@gmail.com'
    }
  }).then(function () {
    done();
  });
});
//# sourceMappingURL=admin_test.js.map