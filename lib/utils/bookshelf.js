'use strict';

var config = require('../../config');
var options = config.get('postgresql');

var knex = require('knex')(options);

var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
