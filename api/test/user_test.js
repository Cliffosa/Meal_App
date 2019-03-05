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
                .get('/api/v1/account/user')
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
});

// describe('User Auth Signup Endpoint Tests', () => {
//   it('POST /auth/signup - User SignUp Validation Test(Required)', done => {
//     chai
//       .request(app)
//       .post(`/api/v1/auth/signup`)
//       .send({
//         name: 'Roger Test',
//         email: 'roger@test.com',
//         phone: '08028372825'
//       })
//       .then(res => {
//         expect(res).to.have.status(400);
//         assert.equal(res.body.status, 'error');
//         assert.equal(res.body.type, 'validation');
//         done();
//       })
//       .catch(err => console.log('POST /auth/signup', err.message));
//   });
//   it('POST /auth/signup - User SignUp Validation Test(Email)', done => {
//     chai
//       .request(app)
//       .post(`/api/v1/auth/signup`)
//       .send({
//         name: 'Roger Test',
//         email: 'roger',
//         phone: '08028372825',
//         password: 'pass'
//       })
//       .then(res => {
//         expect(res).to.have.status(400);
//         assert.equal(res.body.status, 'error');
//         assert.equal(res.body.type, 'validation');
//         done();
//       })
//       .catch(err => console.log('POST /auth/signup', err.message));
//   });
//   it('POST /auth/signup - User Can Sign Up', done => {
//     chai
//       .request(app)
//       .post(`/api/v1/auth/signup`)
//       .send({
//         name: 'Roger Test',
//         email: 'roger@test.com',
//         phone: '08028372825',
//         password: 'password'
//       })
//       .then(res => {
//         expect(res).to.have.status(201);
//         assert.equal(res.body.status, 'success');
//         done();
//       })
//       .catch(err => console.log('POST /auth/signup', err.message));
//   });
//   it("POST /auth/signup - User Can't signup again with the same email", done => {
//     chai
//       .request(app)
//       .post(`/api/v1/auth/signup`)
//       .send({
//         name: 'Roger Test',
//         email: 'roger@test.com',
//         phone: '08028372825',
//         password: 'password'
//       })
//       .then(res => {
//         expect(res).to.have.status(500);
//         assert.equal(res.body.status, 'error');
//         done();
//       })
//       .catch(err => console.log('POST /auth/signup', err.message));
//   });
// });

// describe('User Auth Login Endpoint Tests', () => {
//   it('POST /auth/login - User Login Validation Test(Required)', done => {
//     chai
//       .request(app)
//       .post(`/api/v1/auth/login`)
//       .send({
//         email: 'roger@test.com'
//       })
//       .then(res => {
//         expect(res).to.have.status(400);
//         assert.equal(res.body.status, 'error');
//         assert.equal(res.body.type, 'validation');
//         done();
//       })
//       .catch(err => console.log('POST /auth/login', err.message));
//   });
//   it('POST /auth/login - User Login Validation Test(Email)', done => {
//     chai
//       .request(app)
//       .post(`/api/v1/auth/login`)
//       .send({
//         email: 'roger',
//         password: 'password'
//       })
//       .then(res => {
//         expect(res).to.have.status(400);
//         assert.equal(res.body.status, 'error');
//         assert.equal(res.body.type, 'validation');
//         done();
//       })
//       .catch(err => console.log('POST /auth/login', err.message));
//   });
//   it('POST /auth/login - User Cannot Login without being registered', done => {
//     chai
//       .request(app)
//       .post(`/api/v1/auth/login`)
//       .send({
//         email: 'thesis@science.com',
//         password: 'password'
//       })
//       .then(res => {
//         expect(res).to.have.status(500);
//         assert.equal(res.body.status, 'error');
//         done();
//       })
//       .catch(err => console.log('POST /auth/login', err.message));
//   });
//   it('POST /auth/login - User Can Login', done => {
//     chai
//       .request(app)
//       .post(`/api/v1/auth/login`)
//       .send({
//         email: 'roger@test.com',
//         password: 'password'
//       })
//       .then(res => {
//         expect(res).to.have.status(200);
//         assert.equal(res.body.status, 'success');
//         done();
//       })
//       .catch(err => console.log('POST /auth/login', err.message));
//   });
//   it("POST /auth/login - User Can't login with incorrect password", done => {
//     chai
//       .request(app)
//       .post(`/api/v1/auth/login`)
//       .send({
//         email: 'roger@test.com',
//         password: 'password111'
//       })
//       .then(res => {
//         expect(res).to.have.status(500);
//         assert.equal(res.body.status, 'error');
//         done();
//       })
//       .catch(err => console.log('POST /auth/login', err.message));
//   });
// });

// after(done => {
//   User.destroy({ where: { email: 'roger@test.com' } }).then(() => {
//     done();
//   });
// });
