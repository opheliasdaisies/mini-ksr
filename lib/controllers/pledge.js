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

  function savePledge(pledgeAttributes) {
    return Pledge.create(pledgeAttributes);
  }

  function validatePledge(pledge) {
    return pledge.validate();
  }

  return pledgePromise
    .then(validatePledge)
    .then(savePledge);
  // .catch(console.error);
}

module.exports = {
  backProject: backProject
};
