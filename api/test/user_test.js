import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import User from '../src/models/user';
const { assert, expect } = chai;
chai.use(chaiHttp);

const PREFIX = '/api/v1/auth';
before(done => {
  done();
});
describe('User Auth Endpoints', () => {
  it('POST /auth/signup - User Can Sign Up', done => {
    chai
      .request(server)
      .post(`${PREFIX}/signup`)
      .send({
        name: 'Roger Test',
        email: 'ford@gmail.com',
        phone: '08028372825',
        password: 'password'
      })
      .then(res => {
        expect(res).to.have.status(201);
        assert.equal(res.body.status, 'success');
        done();
      })
      .catch(err => console.log('POST /auth/signup', err.message));
  });

  it('POST /auth/login - User Can Login', done => {
    chai
      .request(server)
      .post(`${PREFIX}/login`)
      .send({
        email: 'ford@gmail.com',
        password: 'password'
      })
      .then(res => {
        expect(res).to.have.status(200);
        assert.equal(res.body.status, 'success');
        done();
      })
      .catch(err => console.log('POST /auth/login', err.message));
  });
});
after(done => {
  User.destroy({ where: { email: 'ford@gmail.com' } }).then(() => {
    done();
  });
});
