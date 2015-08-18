'use strict';

var bookshelf = require('../utils/bookshelf');
var projectValidation = require('../validations/projectValidation');
var Pledge = require('./Pledge');

var Project = bookshelf.Model.extend({

  tableName: 'projects',

  pledges: function () {
    return this.hasMany(Pledge, 'project_id');
  },

  validate: function () {
    return projectValidation.run(this.attributes);
  }

});

module.exports = Project;
