const Validator = require('validator');
const isEmpty = require('../utils/is-empty');

module.exports = function validateRegister({ first_name, last_name, by_father, email, password, permission }) {
  const errors = {};

  first_name = !isEmpty(first_name) ? first_name : '';
  last_name = !isEmpty(last_name) ? last_name : '';
  by_father = !isEmpty(by_father) ? by_father : '';
  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';
  permission = !isEmpty(permission) ? permission : null;

  if (!Validator.isLength(first_name, { min: 3, max: 30 })) {
    errors.first_name = 'Name must be between 3 and 30 characters';
  }

  if (Validator.isEmpty(first_name)) {
    errors.first_name = 'Name field is required';
  }

  if (!Validator.isLength(last_name, { min: 3, max: 30 })) {
    errors.last_name = 'Name must be between 3 and 30 characters';
  }

  if (Validator.isEmpty(last_name)) {
    errors.last_name = 'Name field is required';
  }

  if (!Validator.isLength(by_father, { min: 3, max: 30 })) {
    errors.by_father = 'Name must be between 3 and 30 characters';
  }

  if (Validator.isEmpty(by_father)) {
    errors.by_father = 'Name field is required';
  }

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password field is required';
  }

  if (!permission) {
    errors.permission = 'Permissions field is required';
  }

  return { errors, isValid: isEmpty(errors) };
};
