'use strict';

var Checkit = require('checkit');
var Project = require('../models/Project');
var Pledge = require('../models/Pledge');
var findExistingProject = require('../utils/findExistingProject');
var handleCheckitError = require('../utils/checkitErrorHandler');

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
  return Project.findOne({
    where: {
      name: projectName
    },
    include: [Pledge]
  });
}

module.exports = {
  createProject: createProject,
  listProject: listProject
};
