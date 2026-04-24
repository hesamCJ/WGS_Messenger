const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  initiateCall,
  answerCall,
  rejectCall,
  endCall,
  getCallHistory
} = require('../controllers/callController');

router.post('/', auth, initiateCall);
router.post('/:callId/answer', auth, answerCall);
router.post('/:callId/reject', auth, rejectCall);
router.post('/:callId/end', auth, endCall);
router.get('/:userId/history', auth, getCallHistory);

module.exports = router;
