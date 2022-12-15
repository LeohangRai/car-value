/* 
  This file is not being used at the moment.
  Previously, (for demostration purposes) we had used this as a helper function to setup "cookie-session" Global middleware and validationPipe into our AppModule (both inside the "main.ts" file and E2E test files).
  Currently, we have migrated the setup code within our AppModule file.
*/
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
