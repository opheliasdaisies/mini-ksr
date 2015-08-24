'use strict';

function handleCheckitError(err) {

  var errors = err.toJSON();

  var errorKeys = Object.keys(errors);
  var firstErrorGroup = errors[errorKeys[0]];

  throw new Error(firstErrorGroup[0]);

}

module.exports = handleCheckitError;
