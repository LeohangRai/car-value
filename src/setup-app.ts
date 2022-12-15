import { ValidationPipe } from '@nestjs/common';
/* eslint-disable */
const cookieSession = require('cookie-session');
/* eslint-enable */

export const setupApp = (app: any) => {
  app.use(
    cookieSession({
      keys: ['fdasfdalkjsfhe']
    })
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );
};
