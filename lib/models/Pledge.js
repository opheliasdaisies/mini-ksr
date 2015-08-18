'use strict';

var bookshelf = require('../utils/bookshelf');
var pledgeValidation = require('../validations/pledgeValidation');

var Pledge = bookshelf.Model.extend({

  tableName: 'pledges',

  validate: function () {
    console.log('validation');
    return pledgeValidation.run(this.attributes);
  }

});

module.exports = Pledge;
