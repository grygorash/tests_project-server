const Validator = require('validator');
const isEmpty = require('../utils/is-empty');

module.exports = function validateForgotPassword(res) {
  let { email } = res;
  const errors = {};

  email = !isEmpty(email) ? email : '';

  if (!Validator.isEmail(email)) {
    errors.email = 'Невірна електронна пошта';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Обов\'язкове поле';
  }

  return { errors, isValid: isEmpty(errors) };
};
