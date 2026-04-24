const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  upgradeToPremium,
  checkPremiumStatus,
  cancelPremium
} = require('../controllers/premiumController');

router.post('/upgrade', auth, upgradeToPremium);
router.get('/status', auth, checkPremiumStatus);
router.post('/cancel', auth, cancelPremium);

module.exports = router;