import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

// el estilo de las pruebas
chai.should();
chai.use(chaiHttp);

describe('The server', () => {
  it('should actually return something', (done: () => void) => {
    chai.request(server)
      .get('/free/ping')
      .end((err, response) => {
        response.should.have.status(200);
        done();
      });
  });
});
