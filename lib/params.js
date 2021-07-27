const path = require('path');

module.exports  = {
  workDir      : process.cwd(),
  configDir    : path.join(process.cwd(), 'config'),
  serverDir    : path.join(process.cwd(), 'server'),
  clientDir    : path.join(process.cwd(), 'client'),
  langDir      : path.join(process.cwd(), 'lang'),
  testDir      : path.join(process.cwd(), 'test'),
  migrationDir : path.join(process.cwd(), 'server', 'migrations'),

  migrationTable : 'efik.migration',

  lang     : 'en',
  timezone : 'Europe/Paris'
};
