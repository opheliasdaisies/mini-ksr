var Checkit = require('checkit');

var project = new Checkit({
  name: [
    {
      rule: 'required',
      message: 'You must supply a name for your project.'
    }, {
      rule: 'alphaDash',
      message: 'Project names can only include alphaneumeric characters, dashes, and underscores.'
    }, {
      rule: 'min: 4',
      message: 'Your project name must be longer than 3 characters.'
    }, {
      rule: 'max:20',
      message: 'Your project name must be longer than 20 characters.'
    }],
  target: [
    {
      rule: 'required',
      message: 'You must supply a target value for your project.'
    }, {
      rule: 'numeric',
      message: 'You must enter a number for your project\'s target.'
    }]
});

module.exports = project;
