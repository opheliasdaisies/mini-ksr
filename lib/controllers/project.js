'use strict';

var Checkit = require('checkit');
var Project = require('../models/Project');
var findExistingProject = require('../utils/findExistingProject');

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

  function handleCheckitError(err) {

    var errors = err.toJSON();

    if (errors.name) {
      throw new Error(errors.name);
    }

    if (errors.target) {
      throw new Error(errors.target);
    }
  }

  return project
    .validate()
    .then(checkForExistingName)
    .then(saveProject)
    .catch(Checkit.Error, handleCheckitError);
}

module.exports = {
  createProject: createProject
};
