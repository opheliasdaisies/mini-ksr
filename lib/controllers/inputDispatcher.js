'use strict';

var project = require('./project');
var pledge = require('./pledge');
var createProject = project.createProject;
var backProject = pledge.backProject;
var listProject = project.listProject;
var listBacker = pledge.listBacker;

function takeCommands(command, argArray) {
  switch (command) {
    case 'project':
      createProject.apply(this, argArray)
        .then(project.projectSuccessfullyCreated)
        .catch(project.displayError);
      break;

    case 'back':
      backProject.apply(this, argArray)
        .then(pledge.pledgeSuccessfullyCreated)
        .catch(project.displayError);
      break;

    case 'list':
      listProject.apply(this, argArray)
        .then(project.listProjectSuccess)
        .catch(project.displayError);
      break;

    case 'backer':
      listBacker.apply(this, argArray)
        .then(pledge.listBackerSuccess)
        .catch(project.displayError);
      break;
  }
}

module.exports = takeCommands;
