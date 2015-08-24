'use strict';

function luhn(cardnumber) {
  // Build an array with the digits in the card number
  var digits = cardnumber.split('');
  for (var i = 0; i < digits.length; i++) {
    digits[i] = parseInt(digits[i], 10);
  }
  // Run the Luhn algorithm on the array
  var sum = 0;
  var alt = false;
  for (i = digits.length - 1; i >= 0; i--) {
    if (alt) {
      digits[i] *= 2;
      if (digits[i] > 9) {
        digits[i] -= 9;
      }
    }
    sum += digits[i];
    alt = !alt;
  }
  // Check the result
  if (sum % 10 == 0) {
    return true;
  } else {
    throw new Error('Entered credit card number is invalid.');
  }
}

module.exports = luhn;
