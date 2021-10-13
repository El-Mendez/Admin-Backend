import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

// el estilo de las pruebas
chai.should();
chai.use(chaiHttp);
const { request } = chai;

describe('Request routes', () => {
  let authToken: string = '';

  before(async () => {
    const response = await request(server)
      .post('/free/login')
      .send({ carne: 0, password: 'elefante azul' });

    response.should.have.status(200);
    response.body.should.have.property('token');
    authToken = response.body.token;
  });

  describe('POST /signup', async () => {
    it('should validate the request body', async () => {
      const response = await request(server)
        .post('/request/signup');

      response.should.have.status(400);
    });

    it('should check if the user already exist', async () => {
      const response = await request(server)
        .post('/request/signup')
        .send({
          carne: 0,
          nombre: 'Pepe',
          apellido: 'Gonzáles',
          carreraId: 1,
          password: 'fake password',
          correo: 'test@uvg.edu.gt',
        });

      response.should.have.status(403);
    });

    it('should check if career exists', async () => {
      const response = await request(server)
        .post('/request/signup')
        .send({
          carne: 1,
          nombre: 'Pepe',
          apellido: 'Gonzáles',
          carreraId: 0,
          password: 'fake password',
          correo: 'test@uvg.edu.gt',
        });

      response.should.have.status(403);
    });

    it('should create the request', async () => {
      const response = await request(server)
        .post('/request/signup')
        .send({
          carne: 1,
          nombre: 'Pepe',
          apellido: 'Gonzáles',
          carreraId: 1,
          password: 'fake password',
          correo: 'test@uvg.edu.gt',
        });

      response.should.have.status(202);
    });
  });

  describe('POST /acceptSignUp', async () => {
    it("should fail if the token doesn't exist", async () => {
      const response = await request(server)
        .post('/request/acceptSignUp')
        .set('Authorization', 'Bearer fake-token');

      response.should.have.status(401);
    });
  });

  describe('POST /passwordReset', async () => {
    it('should verify parameters', async () => {
      const response = await request(server)
        .post('/request/passwordReset');

      response.should.have.status(400);
    });

    it('should send a password reset request', async () => {
      const response = await request(server)
        .post('/request/passwordReset')
        .send({ carne: 0 });

      response.should.have.status(202);
    });
  });

  describe('POST /acceptPasswordReset', () => {
    it('should validate parameters', async () => {
      const response = await request(server)
        .post('/request/acceptPasswordReset');

      response.should.have.status(400);
    });

    it('should check if its a valide auth token', async () => {
      const response = await request(server)
        .post('/request/acceptPasswordReset')
        .send({ newPassword: 'elefante azul' })
        .set('Authorization', 'Bearer fake-token');

      response.should.have.status(401);
    });
  });
});
