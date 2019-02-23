var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/app');
var should = chai.should();

chai.use(chaiHttp);

describe('Meals', () => {
  it('should list ALL meals on /meals GET');
  it('should list a SINGLE meal on /meal/<id> GET');
  it('should add a SINGLE meal on /meals POST');
  it('should update a SINGLE meal on /meal/<id> PUT');
  it('should delete a SINGLE meal on /meal/<id> DELETE');
});
