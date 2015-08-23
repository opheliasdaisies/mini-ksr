'use strict';

var Checkit = require('checkit');

var pledge = new Checkit({

  backer: [{
    rule: 'required',
    message: 'You must supply the first name of the backer.'
  }],
  creditCard: [{
    rule: 'required',
    message: 'You must supply a credit card number.'
  }],
  amount: [{
    rule: 'required',
    message: 'You must supply the dollar amount you want to put towards the project.'
  }],
  projectId: [{
    rule: 'required',
    message: 'You must supply the name of a valid project to back it.'
  }]

});

module.exports = pledge;
