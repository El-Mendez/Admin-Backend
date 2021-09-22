import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

// el estilo de las pruebas
chai.should();
chai.use(chaiHttp);
const { request } = chai;

describe('Free routes', () => {
  it('should be ready', async () => {
    const response = await request(server)
      .get('/free/ping');

    response.should.have.status(200);
  });

  describe('GET /carrera', () => {
    it('should return carreer objects', async () => {
      const response = await request(server)
        .get('/free/carrera');

      response.should.have.status(200);
    });
  });
});
