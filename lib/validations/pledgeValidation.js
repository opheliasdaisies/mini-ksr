'use strict';

var Checkit = require('checkit');

var pledge = new Checkit({

  backer: [{
    rule: 'required',
    message: 'You must supply the first name of the backer.'
  }, {
    rule: 'alphaDash',
    message: 'Backer names can only include alphaneumeric characters, dashes, and underscores.'
  }, {
    rule: 'minLength:4',
    message: 'Backer names must be longer than 3 characters.'
  }, {
    rule: 'maxLength:20',
    message: 'Backer names can not be longer than 20 characters.'
  }],
  creditCard: [{
    rule: 'required',
    message: 'You must supply a credit card number.'
  }, {
    rule: 'numeric',
    message: 'Credit cards must contain only numeric characters.'
  }, {
    rule: 'maxLength:19',
    message: 'Credit card numbers can not be longer than 19 characters.'
  }],
  amount: [{
    rule: 'required',
    message: 'You must supply the dollar amount you want to put towards the project.'
  }, {
    rule: 'numeric',
    message: 'You must enter a number for the amount of your pledge. Do not include a $ sign.'
  }],
  projectId: [{
    rule: 'required',
    message: 'You must supply the name of a valid project to back it.'
  }]

});

module.exports = pledge;
