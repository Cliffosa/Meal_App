process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app';
import User from '../src/models/user';
const { expect } = chai;
chai.use(chaiHttp);

const PREFIX = '/api/v1';

describe('User registration', () => {
  it('Should return 201 and confirmation for valid input', done => {
    //mock valid user input
    let register_details = {
      name: `Rexford`,
      email: `ford@gmail.com`,
      phone: `07060538862`,
      password: `123@abc`
    };
    //send request to the app
    chai
      .request(server)
      .post(`${PREFIX}/signup`)
      .send(register_details)
      .then(res => {
        //console.log(res.body);
        //assertions
        expect(res).to.have.status('succces');
        expect(res.body.message).to.be.equal('User Registered Successfully');
        expect(res.body.errors.length).to.be.equal(0);
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });
});

describe('User login', () => {
  it('should return 200 and token for valid credentials', done => {
    //mock invalid user input
    let login_details = {
      email: `ford@gmail.com`,
      password: `123@abc`
    };
    //send request to the app
    chai
      .request(server)
      .post(`${PREFIX}/login`)
      .send(login_details)
      .then(res => {
        //console.log(res.body);
        //assertions
        expect(res).to.have.status(200);
        expect(res.body.token).to.exist;
        expect(res.body.message).to.be.equal('Login successfully');
        expect(res.body.errors.length).to.be.equal(0);
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });
});

after(done => {
  User.destroy({ where: { email: 'ford@gmail.com' } }).then(() => {
    done();
  });
});
