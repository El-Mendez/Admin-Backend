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

  describe('POST /seccion', async () => {
    it('should validate parameters', async () => {
      const response = await request(server)
        .post('/auth/seccion')
        .set('Authorization', `Bearer ${authToken}`);

      response.should.have.status(400);
    });

    it('should refuse to assign a missing section', async () => {
      const response = await request(server)
        .post('/auth/seccion')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ seccionesId: [0] });

      response.should.have.status(403);
    });
  });

  describe('POST /hobby', async () => {
    it('should validate parameters', async () => {
      const response = await request(server)
        .post('/auth/hobby')
        .set('Authorization', `Bearer ${authToken}`);

      response.should.have.status(400);
    });

    it('should refuse to assign a missing hobby', async () => {
      const response = await request(server)
        .post('/auth/hobby')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hobbiesId: [0] });

      response.should.have.status(403);
    });
  });

  describe('GET /seccion', async () => {
    it('should return the correct schema', async () => {
      const response = await request(server)
        .get('/auth/seccion')
        .set('Authorization', `Bearer ${authToken}`);

      response.should.have.status(200);
    });
  });

  describe('POST /password', async () => {
    it('should validate parameters', async () => {
      const response = await request(server)
        .post('/auth/password')
        .set('Authorization', `Bearer ${authToken}`);

      response.should.have.status(400);
    });

    it('should make sure you enter the right password', async () => {
      const response = await request(server)
        .post('/auth/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ oldPassword: 'fake password', newPassword: 'elefante azul' })

      response.should.have.status(403);
    });

    it('should change your password', async () => {
      const response = await request(server)
        .post('/auth/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ oldPassword: 'elefante azul', newPassword: 'elefante azul' });

      response.should.have.status(201);
    });
  });

  describe('GET /profile', async () => {
    it('should return the user data', async () => {
      const response = await request(server)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      response.should.have.status(200);
    });
  });

  describe('Suggestions Routes', async () => {
    describe('GET /courses', async () => {
      it('should return some data', async () => {
        const response = await request(server)
          .get('/auth/suggestions/courses')
          .set('Authorization', `Bearer ${authToken}`);

        response.should.have.status(200);
      });
    });

    describe('GET /hobbies', async () => {
      it('should return some data', async () => {
        const response = await request(server)
          .get('/auth/suggestions/hobbies')
          .set('Authorization', `Bearer ${authToken}`);

        response.should.have.status(200);
      });
    });
  });
});
