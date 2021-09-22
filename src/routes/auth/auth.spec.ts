import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

// el estilo de las pruebas
chai.should();
chai.use(chaiHttp);
const { request } = chai;

describe('Auth routes', () => {
  let authToken: string = '';

  before(async () => {
    const response = await request(server)
      .post('/free/login')
      .send({ carne: 0, password: 'elefante azul' });

    response.should.have.status(200);
    response.body.should.have.property('token');
    authToken = response.body.token;
  });

  it('should work with a correct token', async () => {
    const response = await request(server)
      .get('/auth/ping')
      .set('Authorization', `Bearer ${authToken}`);

    response.should.have.status(200);
  });

  it('should check if the token is valid', async () => {
    const response = await request(server)
      .get('/auth/ping')
      .set('Authorization', 'Bearer fakeToken');

    response.should.have.status(401);
  });

  it('should check if a token is send', async () => {
    const response = await request(server)
      .get('/auth/ping');

    response.should.have.status(401);
  });

  describe('POST /profile', () => {
    it('should validate parameters', async () => {
      const response = await request(server)
        .get('/auth/profile');
      response.should.have.status(200);
    });

    // TODO implementar más pruebas
  });
});
