'use strict';

var Pledge = require('../models/Pledge');
var Project = require('../models/Project');
var Checkit = require('checkit');
var findExistingProject = require('../utils/findExistingProject');
var checkForDuplicateCreditCards = require('../utils/checkForDuplicateCreditCards');
var handleCheckitError = require('../utils/checkitErrorHandler');
var sequelize = require('../utils/sequelize');
var Promise = sequelize.Promise;

function savePledge(pledgeAttributes) {
  return Pledge.create(pledgeAttributes, {
    include: Project
  });
}

function validatePledge(pledge) {
  return pledge.validate();
}

function backProject(backer, projectName, creditCard, amount) {
  creditCard = creditCard.toString();

  function projectDoesNotExist() {
    throw new Error('You must supply the name of a valid project to back it.');
  }

  function projectFound(project) {
    return checkForDuplicateCreditCards(project, creditCard);
  }

  var pledgePromise = findExistingProject(projectName)
    .then(projectFound, projectDoesNotExist)
    .then(function (project) {
      return Pledge.build({
        backer: backer,
        creditCard: creditCard,
        amount: amount,
        projectId: project.id
      });
    });

  return pledgePromise
    .then(validatePledge)
    .then(savePledge)
    .catch(Checkit.Error, handleCheckitError);
}

function listBacker(backerName) {
  return Pledge.findAll({
      where: {
        backer: backerName
      },
      include: Project
    })
    .then(function (pledges) {
      if (pledges.length === 0) {
        return Promise.reject('Backer does not exist.');
      }
      return pledges;
    });
}

module.exports = {
  backProject: backProject,
  listBacker: listBacker
};
