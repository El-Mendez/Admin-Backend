import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import connection from '../services/Postgres/connection';

// el estilo de las pruebas
chai.should();
chai.use(chaiHttp);
const { request } = chai;

describe('Server', () => {
  it('should have a 404 error', async () => {
    const response = await request(server)
      .get('/jajaja_fake_method_go_brrr');

    response.should.have.status(404);
  });

  it('should have postgres connected', async () => {
    const response = await connection.query('select now();');
    response.rows.should.be.an('array').with.length(1);
  });
});
