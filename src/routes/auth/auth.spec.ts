import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import { connection } from '../../services/Postgres/connection';

// el estilo de las pruebas
chai.should();
chai.use(chaiHttp);
const { request } = chai;

describe('Auth routes', () => {
  let authToken: string = '';

  before(async () => {
    await connection.query('insert into carrera(id, nombre) values (0, \'carrera de prueba\');');
    await connection.query('insert into curso(id, nombre) values (0, \'curso de prueba\');');
    await connection.query('insert into seccion(id, seccion, curso_id) values (0, 0, 0);');
    await connection.query('insert into hobby(id, nombre, description) values (0, \'test hobby\', \'a test hobby\');');
    await connection.query(`
        insert into usuario values 
        (0, 'prueba', 'usuario', 0, crypt('test password', gen_salt('bf')), 'meetinguvg@gmail.com');
    `);
    await connection.query('insert into asiste_seccion(seccion_id, usuario_carne) values (0, 0);');
    await connection.query('insert into has_hobby(hobby_id, usuario_carne) values (0, 0)');

    const response = await request(server)
      .post('/free/login')
      .send({ carne: 0, password: 'test password' });

    response.should.have.status(200);
    response.body.should.have.property('token');
    authToken = response.body.token;
  });

  after(async () => {
    await connection.query('delete from has_hobby where usuario_carne = 0');
    await connection.query('delete from asiste_seccion where usuario_carne = 0');
    await connection.query('delete from usuario where carne = 0;');
    await connection.query('delete from hobby where id = 0');
    await connection.query('delete from seccion where id = 0;');
    await connection.query('delete from curso where id = \'0\';');
    await connection.query('delete from carrera where id = 0;');
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
        .send({ seccionesId: [-1] });

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
        .send({ hobbiesId: [-1] });

      response.should.have.status(403);
    });
  });

  describe('DELETE /hobby', async () => {
    it('should validate parameters', async () => {
      const response = await request(server)
        .delete('/auth/hobby')
        .set('Authorization', `Bearer ${authToken}`);

      response.should.have.status(400);
    });

    it('should verify the hobby assignation even exists', async () => {
      const response = await request(server)
        .delete('/auth/hobby')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hobbyId: -1 });

      response.should.have.status(403);
    });

    it('should actually delete the hobby', async () => {
      const response = await request(server)
        .delete('/auth/hobby')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hobbyId: 0 });

      // Si ya está asignado al hobby esto debería tirar error
      await connection.query('insert into has_hobby(hobby_id, usuario_carne) values (0, 0)');
      response.should.have.status(200);
    });
  });

  describe('GET /seccion', async () => {
    it('should return the correct schema', async () => {
      // TODO validate schema xd
      const response = await request(server)
        .get('/auth/seccion')
        .set('Authorization', `Bearer ${authToken}`);

      response.should.have.status(200);
    });
  });

  describe('DELETE /seccion', async () => {
    it('should validate parameters', async () => {
      const response = await request(server)
        .delete('/auth/seccion')
        .set('Authorization', `Bearer ${authToken}`);

      response.should.have.status(400);
    });

    it('should verify the section assignation even exists', async () => {
      const response = await request(server)
        .delete('/auth/seccion')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ seccionId: -1 });

      response.should.have.status(403);
    });

    it('should actually delete the section asignation', async () => {
      const response = await request(server)
        .delete('/auth/seccion')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ seccionId: 0 });

      // Si ya está asignado a la sección esto debería tirar error
      await connection.query('insert into asiste_seccion(seccion_id, usuario_carne) values (0, 0);');
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
        .send({ oldPassword: 'fake password', newPassword: 'second test password' });

      response.should.have.status(403);
    });

    it('should change your password', async () => {
      const response = await request(server)
        .post('/auth/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ oldPassword: 'test password', newPassword: 'second test password' });

      response.should.have.status(201);

      const verifyResponse = await request(server)
        .post('/free/login')
        .send({ carne: 0, password: 'second test password' });

      verifyResponse.should.have.status(200);
      verifyResponse.body.should.have.property('token');
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

  describe('POST /report', async () => {
    it('should validate parameters', async () => {
      const response = await request(server)
        .post('/auth/report')
        .set('Authorization', `Bearer ${authToken}`);

      response.should.have.status(400);
    });

    it('should check if the reported exist', async () => {
      const response = await request(server)
        .post('/auth/report')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ reported: -1, reason: 'Ser mala onda D:' });

      response.should.have.status(403);
    });

    it('should return no errors if parameters are right', async () => {
      const response = await request(server)
        .post('/auth/report')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ reported: 0, reason: 'Ser mala onda D:' });

      response.should.have.status(201);
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

    // describe('GET /Friends', async () => {
    //   it('should return some data', async () => {
    //     const response = await request(server)
    //       .get('/auth/suggestions/friends')
    //       .set('Authorization', `Bearer ${authToken}`);
    //
    //     response.should.have.status(200);
    //   });
    // });
  });

  describe('Friendship Routes', async () => {
    let secondToken: string = '';

    before(async () => {
      await connection.query(`
        insert into usuario values 
        (1, 'prueba', 'usuario', 0, crypt('test password', gen_salt('bf')), 'meetinguvg@gmail.com');
    `);
      const response = await request(server)
        .post('/free/login')
        .send({ carne: 1, password: 'test password' });

      response.should.have.status(200);
      response.body.should.have.property('token');
      secondToken = response.body.token;
    });

    after(async () => {
      await connection.query('delete from usuario where carne = 1;');
    });

    describe('POST/ sendRequest', async () => {
      it('should add a new friendship request', async () => {
        const response = await request(server)
          .post('/auth/friends/sendRequest')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ carne: 1 });

        response.should.have.status(200);
      });

      it('should check if the users credentials are the same', async () => {
        const response = await request(server)
          .post('/auth/friends/sendRequest')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ carne: 0 });

        response.should.have.status(403);
      });

      it('should check if the friendship request already exist', async () => {
        const response = await request(server)
          .post('/auth/friends/sendRequest')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ carne: 1 });

        response.should.have.status(405);
      });

      it('should check if the friendship already exist', async () => {
        await connection.query('select accept_request(1, 0)');

        const response = await request(server)
          .post('/auth/friends/sendRequest')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ carne: 1 });

        await connection.query('select delete_friend(1, 0);');

        response.should.have.status(407);
      });
    });

    describe('POST/ acceptRequest', async () => {
      it('should accept an existing friendship request', async () => {
        await connection.query('select send_request(0, 1)');

        const response = await request(server)
          .post('/auth/friends/acceptRequest')
          .set('Authorization', `Bearer ${secondToken}`)
          .send({ carne: 0 });

        await connection.query('select delete_friend(1, 0)');

        response.should.have.status(200);
      });

      it('should check if the friendship request exist', async () => {
        const response = await request(server)
          .post('/auth/friends/acceptRequest')
          .set('Authorization', `Bearer ${secondToken}`)
          .send({ carne: 0 });

        response.should.have.status(403);
      });
    });

    describe('POST/ cancelRequest', async () => {
      before(async () => {
        // Asegurando que exista la data necesaria para las pruebas del módulo de amistad
        await request(server)
          .post('/auth/friends/sendRequest')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ carne: 1 });
      });

      it('should cancel an existing friendship request', async () => {
        const response = await request(server)
          .post('/auth/friends/cancelRequest')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ carne: 1 });

        response.should.have.status(200);
      });

      it('should check if the request exist', async () => {
        const response = await request(server)
          .post('/auth/friends/cancelRequest')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ carne: 1 });

        response.should.have.status(403);
      });
    });

    describe('POST/ deleteFriend', async () => {
      it('should delete an existing friend', async () => {
        await connection.query('select send_request(0, 1);');
        await connection.query('select accept_request(1, 0);');

        const response = await request(server)
          .post('/auth/friends/deleteFriend')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ carne: 1 });

        response.should.have.status(200);
      });

      it('should check if the friendship exist', async () => {
        const response = await request(server)
          .post('/auth/friends/deleteFriend')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ carne: 1 });

        response.should.have.status(403);
      });
    });

    describe('GET/ receivedRequests', async () => {
      it('should return some data', async () => {
        const response = await request(server)
          .get('/auth/friends/receivedRequests')
          .set('Authorization', `Bearer ${authToken}`);

        response.should.have.status(200);
      });
    });

    describe('GET/ sentRequests', async () => {
      it('should return some data', async () => {
        const response = await request(server)
          .get('/auth/friends/sentRequests')
          .set('Authorization', `Bearer ${authToken}`);

        response.should.have.status(200);
      });
    });
  });
});
