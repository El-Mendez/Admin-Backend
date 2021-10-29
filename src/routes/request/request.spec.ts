import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import { connection } from '../../services/Postgres/connection';

// el estilo de las pruebas
chai.should();
chai.use(chaiHttp);
const { request } = chai;

describe('Request routes', () => {
  before(async () => {
    await connection.query('insert into carrera(id, nombre) values (0, \'carrera de prueba\');');
    await connection.query(`
        insert into usuario values 
        (0, 'prueba', 'usuario', 0, crypt('test password', gen_salt('bf')), 'meetinguvg@gmail.com');
    `);
  });

  after(async () => {
    await connection.query('delete from usuario where carne = 0;');
    await connection.query('delete from carrera where id = 0;');
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
          carreraId: -1,
          password: 'fake password',
          correo: 'test@uvg.edu.gt',
        });

      response.should.have.status(403);
    });

    it('should create the request', async () => {
      const response = await request(server)
        .post('/request/signup')
        .send({
          carne: -1,
          nombre: 'Pepe',
          apellido: 'Gonzáles',
          carreraId: 0,
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
