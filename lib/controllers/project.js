'use strict';

var Checkit = require('checkit');
var Project = require('../models/Project');

function createProject(name, target) {

  var project = new Project({
    name: name,
    target: target
  });

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
    .then(saveProject)
    .catch(Checkit.Error, handleCheckitError);
}

module.exports = {
  createProject: createProject
};
