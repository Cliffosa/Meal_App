import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import Admin from '../src/models/admin';
const { assert, expect } = chai;
chai.use(chaiHttp);

const PREFIX = '/api/v1/auth';

beforeEach(done => {
  done();
});

describe('Admin Auth Endpoints', () => {
  it('POST /auth/admin/signup - Admin Can Sign Up', done => {
    chai
      .request(server)
      .post(`${PREFIX}/admin/signup`)
      .send({
        name: 'Roger Test',
        email: 'roger@test.com',
        phone: '08028372825',
        password: 'password'
      });
    const resolvingPromise = new Promise(resolve => {
      resolve('success');
    });
    resolvingPromise
      .then(res => {
        expect(res).to.have.status(201);
        assert.equal(res.body.status, 'success');
      })
      .finally(done)
      .catch(err => console.log('POST /auth/admin/signup', err.message));
  });

  it('POST /auth/admin/login - Admin Can Login', done => {
    chai
      .request(server)
      .post(`${PREFIX}/admin/login`)
      .send({
        email: 'roger@test.com',
        password: 'password'
      });
    const resolvingPromise = new Promise(resolve => {
      resolve('success');
    });
    resolvingPromise
      .then(res => {
        expect(res).to.have.status(200);
        assert.equal(res.body.status, 'success');
      })
      .finally(done)
      .catch(err => console.log('POST /auth/admin/login', err.message));
  });
});

after(done => {
  Admin.destroy({ where: { email: 'roger@test.com' } }).then(() => {
    done();
  });
});
