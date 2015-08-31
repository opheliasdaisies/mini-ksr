'use strict';

var Project = require('../models/Project');
var formatNumber = require('../utils/formatNumberForString');

// Takes an error and displays error in the console for users.
function displayError(projectErr) {
  console.log('Error: ' + (projectErr.message || projectErr));
}

// Takes a project and displays a confirmation message in the console.
function projectSuccessfullyCreated(project) {
  var target = formatNumber(project.target);
  console.log('Project ' + project.name + ' has been successfully created with a target of $' + target + '.');
}

// Takes a project and displays backers, pledge amounts, and amount until target is reached in the console.
function listProjectSuccess(project) {
  var remaining = project.target;

  // Iterate through all the project's pledges and log each one.
  project.pledges.forEach(function (pledge) {
    remaining -= pledge.amount;

    var amount = formatNumber(pledge.amount);
    console.log('-- ' + pledge.backer + ' backed for $' + amount);
  });

  // Display a different message if the goal has been reached.
  if (remaining > 0) {
    var remainingStr = formatNumber(remaining);
    console.log(project.name + ' still needs $' + remainingStr + ' to be fully funded.');
  } else {
    console.log(project.name + ' has been fully funded!');
  }
}

// Takes a pledge and displays a confirmation message in the console.
function pledgeSuccessfullyCreated(pledge) {
  // Find project by ID so project name can be displayed in confirmation
  return Project.findById(pledge.projectId)
    .then(function (project) {
      var amount = formatNumber(pledge.amount);
      console.log(pledge.backer + ' backed ' + project.name + ' for $' + amount + '.');
    });
}

// Takes an array of pledges and displays each one, along with pledge amount, in the console.
function listBackerSuccess(pledges) {
  pledges.forEach(function (pledge) {
    var amount = formatNumber(pledge.amount);
    console.log('-- Backed ' + pledge.project.name + ' for $' + amount + '.');
  });
}

module.exports = {
  displayError: displayError,
  projectSuccessfullyCreated: projectSuccessfullyCreated,
  listProjectSuccess: listProjectSuccess,
  pledgeSuccessfullyCreated: pledgeSuccessfullyCreated,
  listBackerSuccess: listBackerSuccess
};
