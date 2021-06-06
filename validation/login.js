const Validator = require('validator');
const isEmpty = require('../utils/is-empty');

module.exports = function validateLogin(res) {
  let { email, password } = res;
  const errors = {};

  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  if (!Validator.isEmail(email)) {
    errors.email = 'Невірна електронна пошта';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Обов\'язкове поле';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Обов\'язкове поле';
  }

  if (!Validator.isLength(password, { min: 6 })) {
    errors.password = 'Пароль повинен бути не меньше 6 символів';
  }

  return { errors, isValid: isEmpty(errors) };
};
