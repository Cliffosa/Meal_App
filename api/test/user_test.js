process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import User from '../src/models/user';
const { assert, expect } = chai;
chai.use(chaiHttp);

const PREFIX = '/api/v1';

let login_details = {
  email: `ford@gmail.com`,
  password: `123@abc`
};

let register_details = {
  name: `Rexford`,
  email: `ford@gmail.com`,
  phone: `07060538862`,
  password: `123@abc`
};

before(done => {
  done();
});

describe('User Auth Signup Endpoint Tests', () => {
  it('POST /auth/signup - User Can Sign Up', done => {
    chai
      .request(server)
      .post(`${PREFIX}/auth/signup`)
      .send({
        register_details
      })
      .then(res => {
        expect(res).to.have.status(201);
        assert.equal(res.body.status, 'success');
        done();
      })
      .catch(err => console.log('POST /auth/signup', err.message));
  });

  it("POST /auth/signup - User Can't signup again with the same email", done => {
    chai
      .request(server)
      .post(`${PREFIX}/auth/signup`)
      .send({
        name: `Rexford`,
        email: `ford@gmail.com`,
        phone: `07060538862`,
        password: `123@abc`
      })
      .then(res => {
        expect(res).to.have.status(500);
        assert.equal(res.body.status, 'error');
        done();
      })
      .catch(err => console.log('POST /auth/signup', err.message));
  });
});

describe('User Auth Login Endpoint Tests', () => {
  it('POST /auth/login - User Cannot Login without being registered', done => {
    chai
      .request(server)
      .post(`${PREFIX}/auth/login`)
      .send({
        login_details
      })
      .then(res => {
        expect(res).to.have.status(500);
        assert.equal(res.body.status, 'error');
        done();
      })
      .catch(err => console.log('POST /auth/login', err.message));
  });

  it('POST /auth/login - User Can Login', done => {
    chai
      .request(server)
      .post(`${PREFIX}/auth/login`)
      .send({
        login_details
      })
      .then(res => {
        expect(res).to.have.status(200);
        assert.equal(res.body.status, 'success');
        done();
      })
      .catch(err => console.log('POST /auth/login', err.message));
  });
  it("POST /auth/login - User Can't login with incorrect password", done => {
    chai
      .request(server)
      .post(`${PREFIX}/auth/login`)
      .send({
        email: 'ford@gmail.com',
        password: 'password111'
      })
      .then(res => {
        expect(res).to.have.status(500);
        assert.equal(res.body.status, 'error');
        done();
      })
      .catch(err => console.log('POST /auth/login', err.message));
  });
});

after(done => {
  User.destroy({ where: { email: 'roger@test.com' } }).then(() => {
    done();
  });
});
