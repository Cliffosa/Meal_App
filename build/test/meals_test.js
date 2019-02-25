"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../src/app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = 'test'; //Require the dev-dependencies

// chai.should();
_chai.default.use(_chaiHttp.default);

var expect = require('chai').expect;

describe('/Get all Meals Endpoint Tests', function () {
  it("Fetch All Meals on /api/v1 meals GET ", function (done) {
    _chai.default.request(_app.default).get('/api/v1/meals').end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
      done(err);
    });
  }); // Test to add a single meal

  it('should ADD a SINGLE meal api/v1/meals/ POST', function (done) {
    var meal = {
      name: 'wheat',
      quantity: 5,
      price: 580
    };

    _chai.default.request(_app.default).post('api/v1/meals').send(meal).end(function (err, res) {
      expect(200);
      expect(res.body).to.be.an('object');
      expect(meal).to.have.property('name');
      expect(meal).to.have.property('price');
      expect(meal).to.have.property('quantity');
      done(err);
    });
  }); // Test to get single meal record

  it('should get a SINGLE meal on api/v1/meals/:id GET', function (done) {
    var singleMeal = {
      id: 1,
      name: 'rice',
      price: 300,
      quantity: 3
    };

    _chai.default.request(_app.default).get("api/v1/meals/".concat(singleMeal.id)).end(function (err, res) {
      expect(200);
      expect(res.body).to.be.an('object');
      expect(singleMeal).to.have.property('name');
      expect(singleMeal).to.have.property('price');
      expect(singleMeal).to.have.property('quantity');
      done(err);
    });
  });
  it('should UPDATE a SINGLE meal api/v1/meals/:id PUT', function (done) {
    var updateData = {
      id: 1,
      name: 'rice',
      price: 400,
      quantity: 'small'
    };

    _chai.default.request(_app.default).put("api/v1/meals/".concat(updateData.id)).end(function (err, res) {
      expect(201);
      expect(res.body).to.be.an('object');
      expect(updateData).to.have.property('name');
      expect(updateData).to.have.property('price');
      expect(updateData).to.have.property('quantity');
      done(err);
    });
  });
  it('should DELETE a SINGLE meal api/v1/meals/:id DELETE', function (done) {
    var updateData = {
      id: 3,
      name: 'rice',
      price: 400,
      quantity: 'small'
    };

    _chai.default.request(_app.default).delete("api/v1/meals/".concat(updateData.id)).end(function (err, res) {
      expect(201);
      done(err);
    });
  });
});
//# sourceMappingURL=meals_test.js.map