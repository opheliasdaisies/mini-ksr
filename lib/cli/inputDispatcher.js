'use strict';

var cliOutput = require('./cliOutput');
var project = require('../controllers/project');
var pledge = require('../controllers/pledge');
var Promise = require('../utils/sequelize').Promise;

function takeCommands(command, argArray) {
  switch (command) {
  case 'project':
    return project.createProject.apply(null, argArray)
      .then(cliOutput.projectSuccessfullyCreated)
      .catch(cliOutput.displayError);

  case 'back':
    return pledge.backProject.apply(null, argArray)
      .then(cliOutput.pledgeSuccessfullyCreated)
      .catch(cliOutput.displayError);

  case 'list':
    return project.listProject.apply(null, argArray)
      .then(cliOutput.listProjectSuccess)
      .catch(cliOutput.displayError);

  case 'backer':
    return pledge.listBacker.apply(null, argArray)
      .then(cliOutput.listBackerSuccess)
      .catch(cliOutput.displayError);

  default:
    return Promise.reject(true);
  }

}

module.exports = takeCommands;
