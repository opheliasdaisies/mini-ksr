'use strict';

var Pledge = require('../models/Pledge');
var Checkit = require('checkit');
var findExistingProject = require('../utils/findExistingProject');
var handleCheckitError = require('../utils/checkitErrorHandler');

function backProject(backer, projectName, creditCard, amount) {
  var pledgePromise = findExistingProject(projectName)
    .then(function (project) {
      if (!project) {
        throw Error('You must supply the name of a valid project to back it.');
      }
      return Pledge.build({
        backer: backer,
        creditCard: creditCard,
        amount: amount,
        projectId: project.id
      });
    });

  function savePledge(pledgeAttributes) {
    console.log(pledgeAttributes);
    return Pledge.create(pledgeAttributes);
  }

  function validatePledge(pledge) {
    return pledge.validate();
  }

  return pledgePromise
    .then(validatePledge)
    .then(savePledge)
    .catch(Checkit.Error, handleCheckitError);
}

module.exports = {
  backProject: backProject
};
