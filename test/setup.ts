import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});

/*
    did not need to do this:
    global.afterEach(async() => {
        const connectionHandle = getConnection();
        await connectionHandle.close();
    })
*/
