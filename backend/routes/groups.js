const express = require('express');
const router = express.Router();

// Groups/Channels route
router.get('/', (req, res) => {
  res.json({ message: 'Groups endpoint' });
});

module.exports = router;
