process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import Admin from '../src/models/admin';
const { assert, expect } = chai;
chai.use(chaiHttp);

let login_details = {
  email: `admin@gmail.com`,
  password: `123@abc`
};

let register_details = {
  name: `Rexford`,
  email: `ford@email.com`,
  phone: `07060538862`,
  password: `123@abc`
};

beforeEach(done => {
  done();
});

describe('Admin Auth Signup Tests', () => {
  it('POST /auth/admin/signup - Admin Can Sign Up', done => {
    chai
      .request(server)
      .post(`/api/v1/auth/admin/signup`)
      .send({
        register_details
      })
      .then(res => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.status('success');
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        done();
      })
      .catch(err => console.log('POST /auth/admin/signup', err.message));
  });

  it("POST /auth/admin/signup - Admin Can't signup again with the existing email", done => {
    chai
      .request(server)
      .post(`/api/v1/auth/admin/signup`)
      .send({
        register_details
      })
      .then(res => {
        expect(res).to.have.status(500);
        assert.equal(res.body).status('error');
        done();
      })
      .catch(err => console.log('POST /auth/admin/signup', err.message));
  });
});

describe('Admin Can Login Endpoint Tests', () => {
  it('POST /auth/admin/login - Admin Cannot Login without first registered', done => {
    chai
      .request(server)
      .post(`/api/v1/auth/admin/login`)
      .send({
        email: 'thisis@science.com',
        password: 'password'
      })
      .then(res => {
        expect(res).to.have.status(500);
        assert.equal(res.body.status, 'error');
        done();
      })
      .catch(err => console.log('POST /auth/admin/login', err.message));
  });
  it('POST /auth/admin/login - Admin Can Login', done => {
    chai
      .request(server)
      .post(`/api/v1/auth/admin/login`)
      .send({
        login_details
      })
      .then(res => {
        expect(res).to.have.status(200);
        assert.equal(res.body.status, 'success');
        done();
      })
      .catch(err => console.log('POST /auth/admin/login', err.message));
  });
  it("POST /auth/admin/login - Admin Can't login with invalid password", done => {
    chai
      .request(server)
      .post(`/api/v1/auth/admin/login`)
      .send({
        email: 'ford@gmail.com',
        password: 'password111'
      })
      .then(res => {
        expect(res).to.have.status(500);
        assert.equal(res.body.status, 'error');
        done();
      })
      .catch(err => console.log('POST /auth/admin/login', err.message));
  });
});

after(done => {
  Admin.destroy({ where: { email: 'roger@test.com' } }).then(() => {
    done();
  });
});
