'use strict';

var bookshelf = require('../utils/bookshelf');
var projectValidation = require('../validations/projectValidation');

var Project = bookshelf.Model.extend({

  tableName: 'projects',

  validate: function() {
    return projectValidation.run(this.attributes);
  }

});

module.exports = Project;
