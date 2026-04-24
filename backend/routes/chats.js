const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getOrCreateChat,
  getAllChats,
  createGroup,
  updateGroup,
  addGroupMember,
  removeGroupMember,
  leaveGroup,
  archiveChat,
  unarchiveChat,
  muteChat,
  pinMessage,
  getPinnedMessages
} = require('../controllers/chatController');

router.post('/private', auth, getOrCreateChat);
router.get('/', auth, getAllChats);
router.post('/group', auth, createGroup);
router.put('/:chatId', auth, updateGroup);
router.post('/:chatId/member/add', auth, addGroupMember);
router.post('/:chatId/member/remove', auth, removeGroupMember);
router.post('/:chatId/leave', auth, leaveGroup);
router.post('/:chatId/archive', auth, archiveChat);
router.post('/:chatId/unarchive', auth, unarchiveChat);
router.post('/:chatId/mute', auth, muteChat);
router.post('/:chatId/pin', auth, pinMessage);
router.get('/:chatId/pinned', auth, getPinnedMessages);

module.exports = router;
