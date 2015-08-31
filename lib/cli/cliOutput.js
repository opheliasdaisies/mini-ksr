'use strict';

var Project = require('../models/Project');

function displayError(projectErr) {
  console.log('Error: ' + (projectErr.message || projectErr));
}

function projectSuccessfullyCreated(project) {
  console.log('Project ' + project.name + ' has been successfully created with a target of $' + project.target + '.');
}

function listProjectSuccess(project) {
  var remaining = project.target;
  project.pledges.forEach(function (pledge) {
    remaining -= pledge.amount;
    console.log('-- ' + pledge.backer + ' backed for $' + pledge.amount);
  });

  if (remaining > 0) {
    console.log(project.name + ' still needs $' + remaining + ' to be fully funded.');
  } else {
    console.log(project.name + ' has been fully funded!');
  }
}

function pledgeSuccessfullyCreated(pledge) {
  return Project.findById(pledge.projectId)
    .then(function (project) {
      console.log(pledge.backer + ' backed ' + project.name + ' for $' + pledge.amount + '.');
    });
}

function listBackerSuccess(pledges) {
  pledges.forEach(function (pledge) {
    console.log('-- Backed ' + pledge.project.name + ' for $' + pledge.amount + '.');
  });
}

module.exports = {
  displayError: displayError,
  projectSuccessfullyCreated: projectSuccessfullyCreated,
  listProjectSuccess: listProjectSuccess,
  pledgeSuccessfullyCreated: pledgeSuccessfullyCreated,
  listBackerSuccess: listBackerSuccess
}
