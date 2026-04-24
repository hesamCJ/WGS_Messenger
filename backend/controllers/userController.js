const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('contacts', 'username avatar')
      .populate('blockedUsers', 'username');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.getProfile());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, avatar, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        bio,
        avatar,
        phone
      },
      { new: true }
    );

    res.json({
      user: user.getProfile(),
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username firstName lastName avatar bio status lastSeen');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    })
      .select('username firstName lastName avatar bio')
      .limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add contact
const addContact = async (req, res) => {
  try {
    const { contactId } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { contacts: contactId } },
      { new: true }
    ).populate('contacts', 'username email avatar');

    res.json({
      user: user.getProfile(),
      message: 'Contact added'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Block user
const blockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { blockedUsers: userId } },
      { new: true }
    );

    res.json({
      message: 'User blocked'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unblock user
const unblockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { blockedUsers: userId } },
      { new: true }
    );

    res.json({
      message: 'User unblocked'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add device token for notifications
const addDeviceToken = async (req, res) => {
  try {
    const { deviceToken } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { deviceTokens: deviceToken } },
      { new: true }
    );

    res.json({ message: 'Device token added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserById,
  searchUsers,
  addContact,
  blockUser,
  unblockUser,
  addDeviceToken
};
