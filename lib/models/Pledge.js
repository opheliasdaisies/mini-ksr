'use strict';

var Sequelize = require('sequelize');
var sequelize = require('../utils/sequelize');
var pledgeValidation = require('../validations/pledgeValidation');

// Model for pledges, with fields
var Pledge = sequelize.define('pledge', {
  // Backer name will be strings
  backer: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Credit card numbers will be numeric
  creditCard: {
    type: Sequelize.NUMERIC,
    allowNull: false
  },
  // Amount pledged will be a decimal with 2 decimal places
  amount: {
    type: Sequelize.DECIMAL,
    allowNull: false
  }
}, {
  instanceMethods: {
    validate: function () {
      return pledgeValidation.run(this.dataValues);
    }
  }
});

module.exports = Pledge;
