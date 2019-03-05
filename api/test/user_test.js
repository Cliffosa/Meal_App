process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import User from '../src/models/user';
const should = chai.should();
const expect = require('chai').expect;
chai.use(chaiHttp);

let login_details = {
  email_or_username: 'email@email.com',
  password: '123@abc'
};

let register_details = {
  fullName: 'Rexford',
  email: 'email@email.com',
  username: 'username',
  password: '123@abc'
};

describe('Create Account, Login and Check Token', () => {
  beforeEach(done => {
    // Reset user mode before each test
    User.remove({}, err => {
      console.log(err);
      done();
    });
  });

  describe('/POST Register', () => {
    it('it should Register, Login, and check token', done => {
      chai
        .request(server)
        .post('/api/v1/auth/register')
        .send(register_details)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.state).to.be.true;

          chai
            .request(server)
            .post('/api/v1/auth/login')
            .send(login_details)
            .end((err, res) => {
              console.log('this was run the login part');
              expect(res).to.have.status(200);
              expect(res.body.state).to.be.true;
              expect(res.body).to.have.property('token');

              let token = res.body.token;
              chai
                .request(server)
                .get('/api/v1/account/user') // @ TODO-- INPUT THE PROTECTED ENDPOINTS
                .set('Authorization', token)
                .end((err, res) => {
                  res.should.have.status(200);
                  expect(res.body.state).to.be.true;
                  res.body.data.should.be.an('object');
                  done();
                });
            });
        });
    });
  });
  afterEach(done => {
    User.destroy({
      where: {
        email: 'email@email.com'
      }
    }).then(() => {
      done();
    });
  });
});
