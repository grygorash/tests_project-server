const express = require('express');
const router = express.Router();

const { login, register, confirmEmail, forgotPassword, resetPassword } = require('../controllers/auth');

router.route('/register').post(register);

router.route('/confirm-email').post(confirmEmail);

router.route('/forgot-password').post(forgotPassword);

router.route('/reset-password').post(resetPassword);

router.route('/login').post(login);

module.exports = router;
