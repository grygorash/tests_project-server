const crypto = require('crypto');

const User = require('../models/User');
const { transport, confirmEmailHtml, forgotPasswordHtml } = require('../utils/nodeMailer');

// validators
const validateBody = require('../utils/validateBody');
const handleResponse = require('../utils/handleResponse');
const registerValidator = require('../validation/register');
const loginValidator = require('../validation/login');
const validateForgotPassword = require('../validation/forgotePassword');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
exports.register = async(req, res, next) => {
  validateBody(res, registerValidator(req.body));
  let response;

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      response = { success: false, errors: { email: `Електронна пошта ${email} вже існує` } };

      return handleResponse(res, response, 400);
    }

    await User.create(req.body);

    response = {
      success: true,
      data: {
        message: `Користувача ${email} створено. Для входу потрібна активація, перевірте свою електронну пошту`,
      },
    };

    await transport.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Активація користувача',
      html: confirmEmailHtml(email),
    });

    return handleResponse(res, response, 201);
  } catch (error) {
    response = { success: false, errors: { message: error.message || error } };

    return handleResponse(res, response, 500);
  }
};

// @route   POST api/auth/confirm-email
// @desc    Confirm email
// @access  Public
exports.confirmEmail = async(req, res, next) => {
  let response;

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      response = { success: false, errors: { message: 'Користувача не знайдено' } };

      return handleResponse(res, response, 401);
    }

    user.active = true;
    await user.save();
    response = { success: true, data: { message: `${email} активовано, ви можете увійти в систему` } };

    return handleResponse(res, response);
  } catch (error) {
    response = { success: false, errors: { message: error.message || error } };

    return handleResponse(res, response, 500);
  }
};

// @route   POST api/auth/forgot-password
// @desc    Forgot Password
// @access  Public
exports.forgotPassword = async(req, res, next) => {
  validateBody(res, validateForgotPassword(req.body));
  let response;

  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      response = { success: false, errors: { email: 'Користувача не знайдено' } };

      return handleResponse(res, response, 404);
    }

    try {
      const resetToken = user.getResetPasswordToken();

      await transport.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Відновлення Паролю',
        html: forgotPasswordHtml(resetToken),
      });

      response = {
        success: true,
        data: {
          message: `На ${email} відправлені інструкції по відновленню пароля`,
        },
      };
      await user.save();

      return handleResponse(res, response, 201);
    } catch (error) {
      response = { success: false, errors: { message: error } };
      user.reset_password_token = undefined;
      user.reset_password_expire = undefined;
      await user.save();

      return handleResponse(res, response, 500);
    }
  } catch (error) {
    response = { success: false, errors: { message: error.message || error } };

    return handleResponse(res, response, 500);
  }
};

// @route   POST api/auth/forgot-password
// @desc    Forgot Password
// @access  Public
exports.resetPassword = async(req, res, next) => {
  const { reset_token, password } = req.body;
  const reset_password_token = crypto.createHash('sha256').update(reset_token).digest('hex');
  let response;

  try {
    const user = await User.findOne({
      reset_password_token,
      reset_password_expire: { $gt: Date.now() },
    });

    user.reset_password_token = undefined;
    user.reset_password_expire = undefined;

    if (!user) {
      response = { success: false, errors: { message: 'Недійсний маркер скидання' } };

      return handleResponse(res, response, 500);
    }

    user.password = password;
	  await user.save();

	  response = { success: true, data: { message: 'Пароль було зміненно' } };

	  return handleResponse(res, response, 201);
  } catch (error) {
    response = { success: false, errors: { message: error.message || error } };

    return handleResponse(res, response, 500);
  }
};

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
exports.login = async(req, res, next) => {
  validateBody(res, loginValidator(req.body));
  let response;

  try {
    const { email, password, remember } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      response = { success: false, errors: { email: 'Користувача не знайдено' } };

      return handleResponse(res, response, 401);
    }

    if (!user.active) {
      response = {
        success: false,
        errors: { message: 'Користувача не активовано. Перевірте свою електронну пошту' },
      };

      return handleResponse(res, response, 400);
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      response = { success: false, errors: { password: 'Невірний пароль' } };

      return handleResponse(res, response, 401);
    }

    const expire = remember ? process.env.JWT_EXPIRE_REMEMBER : process.env.JWT_EXPIRE;
    const token = await user.getSignedToken(expire);
    const responseUser = await User.findOne({ email }, '-__v -password');

    response = { success: true, data: { token, user: responseUser } };

    return handleResponse(res, response);
  } catch (error) {
    response = { success: false, errors: { message: error.message || error } };

    return handleResponse(res, response, 500);
  }
};
