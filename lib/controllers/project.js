'use strict';

var Checkit = require('checkit');
var Project = require('../models/Project');
var findExistingProject = require('../utils/findExistingProject');
var handleCheckitError = require('../utils/checkitErrorHandler');
var sequelize = require('../utils/sequelize');
var Promise = sequelize.Promise;

function checkForExistingName(project) {

  function nameDoesNotExist() {
    return project;
  }

  function nameIsTaken(existingProject) {
    throw new Error('A project with the name ' + project.name + ' already exists. Please try another name.');
  }

  return findExistingProject(project.name)
    .then(nameIsTaken, nameDoesNotExist);
}

function saveProject(projectAttributes) {
  return Project.create(projectAttributes);
}

function createProject(name, target) {
  var project = Project.build({
    name: name,
    target: target
  });

  return project
    .validate()
    .then(checkForExistingName)
    .then(saveProject)
    .catch(Checkit.Error, handleCheckitError);
}

function listProject(projectName) {

  function projectNameNotFound() {
    return Promise.reject('Project does not exist.');
  }

  function projectRetrieved(project) {
    return project;
  }

  return findExistingProject(projectName)
    .then(projectRetrieved, projectNameNotFound);
}

module.exports = {
  createProject: createProject,
  listProject: listProject
};
