const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createStory,
  getStories,
  viewStory,
  deleteStory,
  hideStoryFromUser,
  getStoryViewers
} = require('../controllers/storyController');

router.post('/', auth, createStory);
router.get('/', auth, getStories);
router.post('/:storyId/view', auth, viewStory);
router.delete('/:storyId', auth, deleteStory);
router.post('/:storyId/hide', auth, hideStoryFromUser);
router.get('/:storyId/viewers', auth, getStoryViewers);

module.exports = router;
