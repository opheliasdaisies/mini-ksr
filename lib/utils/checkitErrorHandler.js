'use strict';

function handleCheckitError(err) {

  var errors = err.toJSON();

  if (errors.name) {
    throw new Error(errors.name);
  }

  if (errors.target) {
    throw new Error(errors.target);
  }
}

module.exports = handleCheckitError;
