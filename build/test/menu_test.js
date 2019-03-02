"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../src/app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = 'test'; //Require the dev-dependencies

// chai.should();
_chai.default.use(_chaiHttp.default);

var expect = require('chai').expect;

describe('/Get all MENU Endpoint Tests', function () {
  it("Fetch meel for a day on /api/v1menu/:day GET ", function (done) {
    var meal = {
      name: 'rice',
      day: 'monday'
    };

    _chai.default.request(_app.default).get('/api/v1/menu/meal.day').end(function (err, res) {
      expect(meal).to.have.property('day');
      expect(res.body).to.be.an('object');
      done(err);
    });
  }); // Test to add a single meal

  it('should ADD a SINGLE meal to menu on a specific day at api/v1/menu/ POST', function (done) {
    var meal = {
      name: 'continental',
      meal: 'rice',
      day: 'monday'
    };

    _chai.default.request(_app.default).post('api/v1/meals').send(meal).end(function (err, res) {
      expect(200);
      expect(res.body).to.be.an('object');
      expect(meal).to.have.property('name');
      expect(meal).to.have.property('meal');
      expect(meal).to.have.property('day');
      done(err);
    });
  });
});
//# sourceMappingURL=menu_test.js.map