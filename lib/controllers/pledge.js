'use strict';

var Pledge = require('../models/Pledge');
var findExistingProject = require('../utils/findExistingProject');

function backProject(backer, projectName, creditCard, amount) {
  var pledgePromise = findExistingProject(projectName)
    .then(function (project) {
      return new Pledge({
        backer: backer,
        creditCard: creditCard,
        amount: amount,
        project_id: project.get('id')
      });
    });

  return pledgePromise
    // .then(function(pledge) {
    //   return pledge.validate();
    // })
    .then(function(pledge) {
      return pledge.save();
    });
}

module.exports = {
  backProject: backProject
};
