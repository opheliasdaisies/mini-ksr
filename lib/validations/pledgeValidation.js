'use strict';

var Checkit = require('checkit');

var pledge = new Checkit({

  backer: [{
    rule: 'required',
    message: 'You must supply the first name of the backer.'
  }],
  project: [{
    rule: 'required',
    message: 'You must supply the name of the project you want to back.'
  }],
  creditCard: [{
    rule: 'required',
    message: 'You must supply a credit card number.'
  }],
  amount: [{
    rule: 'required',
    message: 'You must supply the dollar amount you want to put towards the project.'
  }]

});

module.exports = pledge;
