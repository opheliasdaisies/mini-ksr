'use strict';

var Project = require('../models/Project');
var Pledge = require('../models/Pledge');

function findProject(name) {
  return Project.findOne({
    where: {
      name: name
    },
    include: [Pledge]
  });
}

module.exports = findProject;
