'use strict';

var knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'sara',
    database: 'kickstarter'
  }
});

var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
