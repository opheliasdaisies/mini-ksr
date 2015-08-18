'use strict';

var Project = require('../models/Project');

function findProject(name) {
  return new Project({
      name: name
    })
    .fetch();
}

module.exports = findProject;
