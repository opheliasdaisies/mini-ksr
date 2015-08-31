'use strict';

var Project = require('../models/Project');
var Pledge = require('../models/Pledge');

function findProject(name) {
  return Project.findOne({
    where: {
      name: name
    },
    include: [Pledge]
  })
  .then(function(project){
    if (project){
      return Promise.resolve(project);
    }
    return Promise.reject(project);
  });
}

module.exports = findProject;
