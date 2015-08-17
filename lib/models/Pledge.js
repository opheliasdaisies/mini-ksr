'use strict';

var bookshelf = require('../utils/bookshelf');
var pledgeValidation = require('../validations/pledgeValidation');

var Pledge = bookshelf.Model.extend({

  tableName: 'pledges',

  validate: function () {
    pledgeValidation.run(this.attributes);
  }

});

module.exports = Pledge;
