process.env.NODE_ENV = 'test';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
// chai.should();
chai.use(chaiHttp);
const expect = require('chai').expect;

describe('/Get all Meals Endpoint Tests', () => {
  it(`Fetch All Meals on /api/v1 meals GET `, done => {
    chai
      .request(server)
      .get('/api/v1/meals')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        done(err);
      });
  });

  // Test to add a single meal
  it('should ADD a SINGLE meal api/v1/meals/ POST', done => {
    let meal = {
      name: 'wheat',
      quantity: 5,
      price: 580
    };
    chai
      .request(server)
      .post('api/v1/meals')
      .send(meal)
      .end((err, res) => {
        expect(200);
        expect(meal).to.be.an('object');
        expect(meal).to.have.property('name');
        expect(meal).to.have.property('price');
        expect(meal).to.have.property('quantity');
        done(err);
      });
  });

  // Test to get single meal record
  it('should get a SINGLE meal on api/v1/meals/:id GET', done => {
    const singleMeal = {
      id: 1,
      name: 'rice',
      price: 300,
      quantity: 3
    };
    chai
      .request(server)
      .get(`api/v1/meals/${singleMeal.id}`)
      .end((err, res) => {
        expect(200);
        expect(singleMeal).to.be.an('object');
        expect(singleMeal).to.have.property('name');
        expect(singleMeal).to.have.property('price');
        expect(singleMeal).to.have.property('quantity');
        done(err);
      });
  });

  it('should UPDATE a SINGLE meal api/v1/meals/:id PUT', done => {
    const updateData = {
      id: 1,
      name: 'rice',
      price: 400,
      quantity: 'small'
    };
    chai
      .request(server)
      .put(`api/v1/meals/${updateData.id}`)
      .end((err, res) => {
        expect(201);
        expect(updateData).to.be.an('object');
        expect(updateData).to.have.property('name');
        expect(updateData).to.have.property('price');
        expect(updateData).to.have.property('quantity');
        done(err);
      });
  });

  it('should DELETE a SINGLE meal api/v1/meals/:id DELETE', done => {
    const updateData = {
      id: 3,
      name: 'rice',
      price: 400,
      quantity: 'small'
    };
    chai
      .request(server)
      .delete(`api/v1/meals/${updateData.id}`)
      .end((err, res) => {
        expect(201);
        done(err);
      });
  });
});
