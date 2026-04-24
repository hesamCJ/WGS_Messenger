const Story = require('../models/Story');
const User = require('../models/User');

// Create story
const createStory = async (req, res) => {
  try {
    const { media, mediaType, text, textColor, backgroundColor, allowedViewers } = req.body;

    const story = new Story({
      user: req.userId,
      media,
      mediaType,
      text,
      textColor,
      backgroundColor,
      allowedViewers: allowedViewers && allowedViewers.length > 0 ? allowedViewers : undefined
    });

    await story.save();
    await story.populate('user', 'username avatar');

    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stories
const getStories = async (req, res) => {
  try {
    const currentDate = new Date();

    const stories = await Story.find({
      expiresAt: { $gt: currentDate },
      $or: [
        { allowedViewers: { $size: 0 } },
        { allowedViewers: req.userId },
        { user: req.userId }
      ],
      hiddenFrom: { $ne: req.userId }
    })
      .populate('user', 'username avatar status')
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View story
const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findByIdAndUpdate(
      storyId,
      {
        $addToSet: {
          viewedBy: {
            user: req.userId,
            viewedAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('user', 'username avatar');

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete story
const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Story.findByIdAndDelete(storyId);

    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hide story from user
const hideStoryFromUser = async (req, res) => {
  try {
    const { storyId } = req.params;

    await Story.findByIdAndUpdate(
      storyId,
      { $addToSet: { hiddenFrom: req.userId } }
    );

    res.json({ message: 'Story hidden' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get story viewers
const getStoryViewers = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const viewers = await User.find(
      { _id: { $in: story.viewedBy.map(v => v.user) } }
    ).select('username avatar');

    res.json(viewers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStory,
  getStories,
  viewStory,
  deleteStory,
  hideStoryFromUser,
  getStoryViewers
};
