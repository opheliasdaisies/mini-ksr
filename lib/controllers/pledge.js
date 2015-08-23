'use strict';

var Pledge = require('../models/Pledge');
var findExistingProject = require('../utils/findExistingProject');

function backProject(backer, projectName, creditCard, amount) {
  var pledgePromise = findExistingProject(projectName)
    .then(function (project) {
      return Pledge.build({
        backer: backer,
        creditCard: creditCard,
        amount: amount,
        projectId: project.get('id')
      });
    });

  function savePledge(pledge) {
    return pledge.save();
  }

  return pledgePromise
    // .then(function(pledge) {
    //   return pledge.validate();
    // })
    .then(savePledge)
    .catch(console.error);
}

module.exports = {
  backProject: backProject
};
