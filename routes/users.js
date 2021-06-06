const express = require('express');
const router = express.Router();

const { getUsers, getCurrentUser, getUser, deleteUser } = require('../controllers/users');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getUsers);

router.route('/current').get(protect, getCurrentUser);

router.route('/:userId').get(protect, getUser);

router.route('/:userId').delete(protect, deleteUser);

module.exports = router;
