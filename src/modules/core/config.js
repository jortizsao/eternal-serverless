import fs from 'fs';
import nconf from 'nconf';

export default (stores) => {
  const storesFiles = stores || {};

  console.log('%s - \u001b[32minfo\u001b[39m: [config] using [%s] configuration',
    new Date().toISOString(), process.env.NODE_ENV);

  //  Hierarchy
  //
  //  1. Environment variables
  //  2. Arguments
  //  3. ConfigFiles
  nconf.env('__');
  nconf.argv();

  let i = 0;
  storesFiles.forEach((configFile) => {
    i += 1;
    if (configFile) {
      if (fs.existsSync(configFile)) {
        nconf.file(`f${i}`, configFile);
        console.log('%s - \u001b[32minfo\u001b[39m: [config] using file [%s]',
          new Date().toISOString(),
          configFile);
      } else {
        console.log('%s - \u001b[31mwarn\u001b[39m: [config] file [%s] not exists',
          new Date().toISOString(),
          configFile);
      }
    }
  });

  return nconf;
};
