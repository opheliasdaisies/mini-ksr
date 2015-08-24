'use strict';

function checkForDuplicateCreditCards(project, creditCard) {
  return project.getPledges({
      where: {
        creditCard: creditCard
      }
    })
    .then(function (pledges) {
      if (pledges.length > 0) {
        throw Error('That credit card has already been used. Please use a different credit card.');
      }
      return project;
    });
}

module.exports = checkForDuplicateCreditCards;
