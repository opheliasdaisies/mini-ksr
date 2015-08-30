'use strict';

var Checkit = require('checkit');

var project = new Checkit({
  name: [{
    rule: 'required',
    message: 'You must supply a name for your project.'
  }, {
    rule: 'alphaDash',
    message: 'Project names can only include alphaneumeric characters, dashes, and underscores.'
  }, {
    rule: 'minLength:4',
    message: 'Your project name must be longer than 3 characters.'
  }, {
    rule: 'maxLength:20',
    message: 'Your project name can not be longer than 20 characters.'
  }],
  target: [{
    rule: 'required',
    message: 'You must supply a target value for your project.'
  }, {
    rule: 'numeric',
    message: 'You must enter a number for your project\'s target. Do not include a $ sign.'
  }, {
    rule: 'greaterThan:0',
    message: 'You must enter a number greater than 0 for your target. Do not include a $ sign.'
  }]
});

module.exports = project;
