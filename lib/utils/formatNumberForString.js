'use strict';

var math = require('mathjs');

// Takes a number and returns a number with two decimal points without exponential notation
function formatNumber(numStr) {
  var num = Number(numStr);
  return math.format(num, {
    notation: 'fixed',
    precision: 2
  });
}

module.exports = formatNumber;
