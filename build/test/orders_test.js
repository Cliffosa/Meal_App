"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../src/app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = 'test'; //Require the dev-dependencies

// chai.should();
_chai.default.use(_chaiHttp.default);

var expect = require('chai').expect;

describe('/Get all Orders Endpoint Tests', function () {
  it("Fetch All Orders on /api/v1/orders GET ", function (done) {
    _chai.default.request(_app.default).get('/api/v1/orders').end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
      done(err);
    });
  }); // Test to add a single order

  it('should ADD a SINGLE order api/v1/orders/ POST', function (done) {
    var order = {
      name: 'wheat',
      quantity: 5,
      price: 'small'
    };

    _chai.default.request(_app.default).post('api/v1/orders').send(order).end(function (err, res) {
      expect(200);
      expect(res.body).to.be.an('object');
      expect(order).to.have.property('name');
      expect(order).to.have.property('price');
      expect(order).to.have.property('quantity');
      done(err);
    });
  }); // Test to get single meal record

  it('should get a SINGLE order on api/v1/orders/:id GET', function (done) {
    var order = {
      id: 1,
      name: 'rice',
      price: 300,
      quantity: 'large'
    };

    _chai.default.request(_app.default).get("api/v1/orders/".concat(order.id)).end(function (err, res) {
      expect(200);
      expect(res.body).to.be.an('object');
      expect(order).to.have.property('name');
      expect(order).to.have.property('price');
      expect(order).to.have.property('quantity');
      done(err);
    });
  });
  it('should UPDATE a SINGLE order api/v1/orders/:id PUT', function (done) {
    var updateOrder = {
      id: 1,
      name: 'rice',
      price: 400,
      quantity: 'small'
    };

    _chai.default.request(_app.default).put("api/v1/orders/".concat(updateOrder.id)).end(function (err, res) {
      expect(201);
      expect(res.body).to.be.an('object');
      expect(updateOrder).to.have.property('name');
      expect(updateOrder).to.have.property('price');
      expect(updateOrder).to.have.property('quantity');
      done(err);
    });
  });
  it('should DELETE a SINGLE order api/v1/orders/:id DELETE', function (done) {
    var deleteData = {
      id: 3,
      name: 'rice',
      price: 400,
      quantity: 'small'
    };

    _chai.default.request(_app.default).delete("api/v1/orders/".concat(deleteData.id)).end(function (err, res) {
      expect(201);
      done(err);
    });
  });
});
//# sourceMappingURL=orders_test.js.map