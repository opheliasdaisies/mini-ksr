'use strict';

var nconf = require('nconf');
var path = require('path');

// Environment will default to development if none provided.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var env = process.env.NODE_ENV;

nconf.use('memory');

nconf.argv()
  .env()
  .file(path.join(__dirname, env + '_config.json'));

module.exports = nconf;
