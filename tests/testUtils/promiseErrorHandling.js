'use strict';

var sequelize = require('../../lib/utils/sequelize');
var Promise = sequelize.Promise;
Promise.onPossiblyUnhandledRejection(function (error) {
  throw error;
});
Promise.longStackTraces();

// module.exports = Promise;
