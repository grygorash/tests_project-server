const { verify } = require('jsonwebtoken');

const User = require('../models/User');
const handleResponse = require('../utils/handleResponse');

exports.protect = async(req, res, next) => {
  let token; let response;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    response = { success: false, errors: { user: 'Not authorized to access this route' } };

    return handleResponse(res, response, 401);
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id, '-__v -password -reset_password_expire -reset_password_token');

    if (!user) {
      response = { success: false, errors: { user: `No user found with ID: ${decoded.id}` } };

      return handleResponse(res, response, 404);
    }

    req.user = user;

    next();
  } catch (error) {
    response = { success: false, errors: { user: 'Not authorized to access this route' } };

    return handleResponse(res, response, 401);
  }
};
