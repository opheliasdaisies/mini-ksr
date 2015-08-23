'use strict';

function handleCheckitError(err) {

  var errors = err.toJSON();

  var errorKeys = Object.keys(errors);
  throw new Error(errors[errorKeys[0]]);

}

module.exports = handleCheckitError;
