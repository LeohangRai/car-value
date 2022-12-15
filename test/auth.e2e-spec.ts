import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  it('handles a signup request', async () => {
    const payload = {
      email: 'randomemail3@gmail.com',
      password: 'helloworld123'
    };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(payload)
      .expect(201)
      .then((res) => {
        const { email } = res.body;
        expect(email).toEqual(payload.email);
      });
  });
});
