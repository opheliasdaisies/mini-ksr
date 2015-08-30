'use strict';

var Pledge = require('../models/Pledge');
var Project = require('../models/Project');
var Checkit = require('checkit');
var findExistingProject = require('../utils/findExistingProject');
var checkForDuplicateCreditCards = require('../utils/checkForDuplicateCreditCards');
var handleCheckitError = require('../utils/checkitErrorHandler');
var sequelize = require('../utils/sequelize');

function backProject(backer, projectName, creditCard, amount) {
  var creditCard = creditCard.toString();
  var pledgePromise = findExistingProject(projectName)
    .then(function (project) {
      return checkForDuplicateCreditCards(project, creditCard);
    })
    .then(function (project) {
      return Pledge.build({
        backer: backer,
        creditCard: creditCard,
        amount: amount,
        projectId: project.id
      });
    });

  function savePledge(pledgeAttributes) {
    return Pledge.create(pledgeAttributes, {include: Project});
  }

  function validatePledge(pledge) {
    return pledge.validate();
  }

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
  .then(function(pledges) {
    if (pledges.length === 0) {
      return Promise.reject('Backer does not exist.');
    }
    return pledges;
  });
}

function pledgeSuccessfullyCreated(pledge) {
  return Project.findById(pledge.projectId)
    .then(function(project){
      console.log(pledge.backer + ' backed ' + project.name + ' for $' + pledge.amount + '.');
      sequelize.close();
    });
}

function listBackerSuccess(pledges){
  pledges.forEach(function(pledge){
    console.log('-- Backed ' + pledge.project.name + ' for $' + pledge.amount + '.');
  });
  sequelize.close();
}

module.exports = {
  backProject: backProject,
  listBacker: listBacker,
  pledgeSuccessfullyCreated: pledgeSuccessfullyCreated,
  listBackerSuccess: listBackerSuccess
};
