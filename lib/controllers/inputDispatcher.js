'use strict';

var project = require('./project');
var pledge = require('./pledge');
var createProject = project.createProject;
var backProject = pledge.backProject;
var listProject = project.listProject;
var listBacker = pledge.listBacker;

function takeCommands(command, argArray) {
  console.log(argArray);
  switch (command) {
  case 'project':
    return createProject.apply(null, argArray)
      .then(project.projectSuccessfullyCreated)
      .catch(project.displayError);

  case 'back':
    return backProject.apply(null, argArray)
      .then(pledge.pledgeSuccessfullyCreated)
      .catch(project.displayError);

  case 'list':
    return listProject.apply(null, argArray)
      .then(project.listProjectSuccess)
      .catch(project.displayError);

  case 'backer':
    return listBacker.apply(null, argArray)
      .then(pledge.listBackerSuccess)
      .catch(project.displayError);
  }
}

module.exports = takeCommands;
