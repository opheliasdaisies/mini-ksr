'use strict';

var Pledge = require('../models/Pledge');
var Project = require('../models/Project');
var Checkit = require('checkit');
var findExistingProject = require('../utils/findExistingProject');
var checkForDuplicateCreditCards = require('../utils/checkForDuplicateCreditCards');
var handleCheckitError = require('../utils/checkitErrorHandler');
var sequelize = require('../utils/sequelize');
var Promise = sequelize.Promise;

// Takes an object of attributes, creates a pledge, and saves it to the database.
// Returns a promise that resovles to the created pledge.
function savePledge(pledgeAttributes) {
  return Pledge.create(pledgeAttributes, {
    include: Project
  });
}

// Runs project validation. Returns an object of attributes.
function validatePledge(pledge) {
  return pledge.validate();
}

// Takes required information for a pledge and returns a promise resolving to the pledge, or a promise resolving to an error if the pledge was not created successfully.
function backProject(backer, projectName, creditCard, amount) {
  if (creditCard) {
    creditCard = creditCard.toString();
  }

  function projectDoesNotExist() {
    throw new Error('You must supply the name of a valid project to back it.');
  }

  function projectFound(project) {
    return checkForDuplicateCreditCards(project, creditCard);
  }

  // Takes required information for pledge and builds Pledge instance but does not save it to database.
  // Returns a promise that resolves to the pledge.
  function buildPledge(project) {
    return Pledge.build({
      backer: backer,
      creditCard: creditCard,
      amount: amount,
      projectId: project.id
    });
  }

  // Calls the chain of functions to create the pledge.
  var pledgePromise = findExistingProject(projectName)
    .then(projectFound, projectDoesNotExist)
    .then(buildPledge)
    .then(validatePledge)
    .then(savePledge)
    .catch(Checkit.Error, handleCheckitError);

    return pledgePromise
}

// Takes a backer name and returns a promise
function findPledgesWithProjects(backerName) {
  return Pledge.findAll({
      where: {
        backer: backerName
      },
      include: Project
    });
}

// Takes a backer name and returns either a rejected promise or a promise that resolves to an array of pledges.
function listBacker(backerName) {
  return findPledgesWithProjects(backerName)
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
