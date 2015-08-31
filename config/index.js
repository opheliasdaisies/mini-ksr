'use strict';

var nconf = require('nconf');
var path = require('path');

// Environment will default to development if none provided.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var env = process.env.NODE_ENV;

nconf.use('memory');

function getCustomConfigPath() {
  var home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  var configFile = env + '_config_ks.json';
  return path.join(home, configFile);
}

// If a custom config file is found in the user's home directory, that will be used.
// If there is no custom config file, the defaults of 'development_config.json' and 'test_config.json' will be used.
nconf
  .env()
  .file('custom', getCustomConfigPath())
  .file('default', path.join(__dirname, env + '_config.json'));

module.exports = nconf;
