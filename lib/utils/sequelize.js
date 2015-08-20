'use strict';

var config = require('../../config').get('postgresql');
var Sequelize = require('sequelize');

// Configure sequelize to connect with database in config file.
// Config file reads NODE_ENV to determine which config to use.
var sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: config.dialect
});

module.exports = sequelize;
