'use strict';

var Checkit = require('checkit');
var Project = require('../models/Project');
var findExistingProject = require('../utils/findExistingProject');
var handleCheckitError = require('../utils/checkitErrorHandler');
var sequelize = require('../utils/sequelize');
var Promise = sequelize.Promise;

function createProject(name, target) {

  var project = Project.build({
    name: name,
    target: target
  });

  function checkForExistingName(project) {
    return findExistingProject(name)
      .then(function (existingProject) {
        if (existingProject) {
          throw new Error('A project with the name ' + name + ' already exists. Please try another name.');
        }
        return project;
      });
  }

  function saveProject() {
    return project.save();
  }

  return project
    .validate()
    .then(checkForExistingName)
    .then(saveProject)
    .catch(Checkit.Error, handleCheckitError);
}

function listProject(projectName) {
  return findExistingProject(projectName)
    .then(function (project) {
      if (!project) {
        return Promise.reject('Project does not exist.');
      }
      return project;
    });
}

function projectSuccessfullyCreated(project) {
  console.log('Project ' + project.get('name') + ' has been successfully created with a target of $' + project.get('target') + '.');
}

function listProjectSuccess(project) {
  var remaining = project.target;
  project.pledges.forEach(function (pledge) {
    remaining -= pledge.amount;
    console.log('-- ' + pledge.backer + ' backed for $' + pledge.amount);
  });

  if (remaining > 0) {
    console.log(project.name + ' still needs $' + remaining + ' to be fully funded.');
  } else {
    console.log(project.name + ' has been fully funded!');
  }
}

function displayError(projectErr) {
  console.log('Error: ' + (projectErr.message || projectErr));
}

module.exports = {
  createProject: createProject,
  listProject: listProject,
  projectSuccessfullyCreated: projectSuccessfullyCreated,
  listProjectSuccess: listProjectSuccess,
  displayError: displayError
};
