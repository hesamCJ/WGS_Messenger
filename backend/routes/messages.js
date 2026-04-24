const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  reactToMessage,
  markAsRead,
  forwardMessage,
  searchMessages
} = require('../controllers/messageController');

router.post('/', auth, sendMessage);
router.get('/:chatId', auth, getMessages);
router.put('/:messageId', auth, editMessage);
router.delete('/:messageId', auth, deleteMessage);
router.post('/:messageId/react', auth, reactToMessage);
router.post('/:messageId/read', auth, markAsRead);
router.post('/forward', auth, forwardMessage);
router.get('/search', auth, searchMessages);

module.exports = router;
