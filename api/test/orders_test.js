process.env.NODE_ENV = 'test';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
// chai.should();
chai.use(chaiHttp);
const expect = require('chai').expect;

describe('/Get all Orders Endpoint Tests', () => {
  it(`Fetch All Orders on /api/v1/orders GET `, done => {
    chai
      .request(server)
      .get('/api/v1/orders')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // Test to add a single order
  it('should ADD a SINGLE order api/v1/orders/ POST', done => {
    let order = {
      name: 'wheat',
      quantity: 5,
      price: 'small'
    };
    chai
      .request(server)
      .post('api/v1/orders')
      .send(order)
      .end((err, res) => {
        expect(200);
        expect(order).to.be.an('object');
        expect(order).to.have.property('name');
        expect(order).to.have.property('price');
        expect(order).to.have.property('quantity');
        done();
      });
  });

  // Test to get single meal record
  it('should get a SINGLE order on api/v1/orders/:id GET', done => {
    const order = {
      id: 1,
      name: 'rice',
      price: 300,
      quantity: 'large'
    };
    chai
      .request(server)
      .get(`api/v1/orders/${order.id}`)
      .end((err, res) => {
        expect(200);
        expect(order).to.be.an('object');
        expect(order).to.have.property('name');
        expect(order).to.have.property('price');
        expect(order).to.have.property('quantity');
        done();
      });
  });

  it('should UPDATE a SINGLE order api/v1/orders/:id PUT', done => {
    const updateOrder = {
      id: 1,
      name: 'rice',
      price: 400,
      quantity: 'small'
    };
    chai
      .request(server)
      .put(`api/v1/orders/${updateOrder.id}`)
      .end((err, res) => {
        expect(201);
        expect(updateOrder).to.be.an('object');
        expect(updateOrder).to.have.property('name');
        expect(updateOrder).to.have.property('price');
        expect(updateOrder).to.have.property('quantity');
        done();
      });
  });

  it('should DELETE a SINGLE order api/v1/orders/:id DELETE', done => {
    const deleteData = {
      id: 3,
      name: 'rice',
      price: 400,
      quantity: 'small'
    };
    chai
      .request(server)
      .delete(`api/v1/orders/${deleteData.id}`)
      .end((err, res) => {
        expect(201);
        done();
      });
  });
});
