process.env.NODE_ENV = 'test';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
// chai.should();
chai.use(chaiHttp);
const expect = require('chai').expect;

describe('/Get all MENU Endpoint Tests', () => {
  it(`Fetch meel for a day on /api/v1menu/:day GET `, done => {
    let meal = {
      name: 'rice',
      day: 'monday'
    };
    chai
      .request(server)
      .get('/api/v1/menu/meal.day')
      .end((err, res) => {
        expect(meal).to.have.property('day');
        expect(res.body).to.be.an('object');
        done(err);
      });
  });

  // Test to add a single meal
  it('should ADD a SINGLE meal to menu on a specific day at api/v1/menu/ POST', done => {
    let meal = {
      name: 'continental',
      meal: 'rice',
      day: 'monday'
    };
    chai
      .request(server)
      .post('api/v1/meals')
      .send(meal)
      .end((err, res) => {
        expect(200);
        expect(meal).to.be.an('object');
        expect(meal).to.have.property('name');
        expect(meal).to.have.property('meal');
        expect(meal).to.have.property('day');
        done(err);
      });
  });
});
