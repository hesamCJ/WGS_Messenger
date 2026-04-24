const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getUserById,
  searchUsers,
  addContact,
  blockUser,
  unblockUser,
  addDeviceToken
} = require('../controllers/userController');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/search', auth, searchUsers);
router.get('/:userId', auth, getUserById);
router.post('/contact/add', auth, addContact);
router.post('/block', auth, blockUser);
router.post('/unblock', auth, unblockUser);
router.post('/device-token', auth, addDeviceToken);

module.exports = router;
