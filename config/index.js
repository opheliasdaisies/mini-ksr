'use strict';

var nconf = require('nconf');
var path = require('path');

// Environment will default to development if none provided.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var env = process.env.NODE_ENV;

nconf.use('memory');

function getCustomConfigPath() {
  var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  var configFile = '/' + env + '_config_ks.json';
  return path.join(home, configFile);
}

nconf
  .env()
  .file('custom', getCustomConfigPath())
  .file('default', path.join(__dirname, env + '_config.json'));


module.exports = nconf;
