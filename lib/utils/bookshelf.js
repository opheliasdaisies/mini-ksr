'use strict';

var options;

if (process.env.NODE_ENV === 'test') {
  options = {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'sara',
      database: 'kickstarter_test'
    }
  }
} else {
  options = {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'sara',
      database: 'kickstarter'
    }
  }
}

var knex = require('knex')(options);

var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
