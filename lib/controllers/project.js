'use strict';

var Checkit = require('checkit');
var Project = require('../models/Project');
var findExistingProject = require('../utils/findExistingProject');
var handleCheckitError = require('../utils/checkitErrorHandler');
var sequelize = require('../utils/sequelize');
var Promise = sequelize.Promise;

// Takes an object of attributes for a project and returns a promise
function checkForExistingName(project) {

  // returns a promise resolving to the project attributes
  function nameDoesNotExist() {
    return project;
  }

  // throws an error if project name already exists
  function nameIsTaken() {
    throw new Error('A project with the name ' + project.name + ' already exists. Please try another name.');
  }

  return findExistingProject(project.name)
    .then(nameIsTaken, nameDoesNotExist);
}

// Takes an object of attributes, creates a project, and saves it to the database.
// Returns a promise that resovles to the created project.
function saveProject(projectAttributes) {
  return Project.create(projectAttributes);
}

function createProject(name, target) {

  // Takes required information for project and builds Project instance but does not save it to database.
  // Returns a promise that resolves to the project.
  function buildProject() {
    return Project.build({
      name: name,
      target: target
    });
  }

  // Calls the chain of functions to create the project
  var newProject = buildProject()
    .validate()
    .then(checkForExistingName)
    .then(saveProject)
    .catch(Checkit.Error, handleCheckitError);

  return newProject;
}

// Takes a project name and returns either a rejected promise or a promise that resolves to a project with its pledge associatons.
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
