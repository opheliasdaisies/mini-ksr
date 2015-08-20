'use strict';

var Sequelize = require('sequelize');
var sequelize = require('../utils/sequelize');
var projectValidation = require('../validations/projectValidation');
// var Pledge = require('./Pledge');

// Model for projects with fields
var Project = sequelize.define('project', {
  // Project names will be unique strings
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  // Target amounts will be decimals with 2 decimal places.
  target: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false
  }
}, {
  instanceMethods: {

    // Use Checkit Validation
    validate: function () {
      return projectValidation.run(this.dataValues);
    }
  }
});

// // Set up has many relationship with pledges
// Project.hasMany(Pledge, {foreign_key: 'project_id'});

Project.sync();

module.exports = Project;
