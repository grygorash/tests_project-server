const User = require('../models/User');
const handleResponse = require('../utils/handleResponse');

// @route   GET api/users/
// @desc    Get users
// @access  Private
exports.getUsers = async(req, res, next) => {
  let response;

  try {
    const results = await User.find({}, '-__v -password -reset_password_expire -reset_password_token');
    const data = { totalResults: results.length, results };

    response = { success: true, data };

    return handleResponse(res, response, 200);
  } catch (error) {
    response = { success: false, errors: { error: error.message || error } };

    return handleResponse(res, response, 404);
  }
};

// @route   GET api/users/current
// @desc    Get current user
// @access  Private
exports.getCurrentUser = async(req, res, next) => {
  const response = { success: true, data: req.user };

  return handleResponse(res, response);
};

// @route   GET api/users/:userId
// @desc    Get user
// @access  Private
exports.getUser = async(req, res, next) => {
  let response;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId, '-__v -password -reset_password_expire -reset_password_token');

    if (!user) {
      response = { success: false, errors: { user: `No user found with ID: ${userId}` } };

      return handleResponse(res, response, 404);
    }

    response = { success: true, data: user };

    return handleResponse(res, response);
  } catch (error) {
    response = { success: false, errors: { user: `No user found with ID: ${userId}` } };

    return handleResponse(res, response, 404);
  }
};

// @route   GET api/users/:userId
// @desc    Delete user
// @access  Private
exports.deleteUser = async(req, res, next) => {
  let response;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId, '-__v -password -reset_password_expire -reset_password_token');

    if (!user) {
      response = { success: false, errors: { user: `No user found with ID: ${userId}` } };

      return handleResponse(res, response, 404);
    }

    await user.remove({ _id: userId });

    response = { success: true, message: `User ${user.username} was deleted` };

    return handleResponse(res, response);
  } catch (error) {
    response = { success: false, errors: { user: `No user found with ID: ${userId}` } };

    return handleResponse(res, response, 404);
  }
};
