'use strict';

var Project = require('../models/Project');

function findProject(name) {
  return Project.findOne({
    where: {
      name: name
    }
  });
}

module.exports = findProject;
