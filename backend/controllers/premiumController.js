const User = require('../models/User');

// Upgrade to premium
const upgradeToPremium = async (req, res) => {
  try {
    const { duration } = req.body; // duration in days

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + duration);

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        isPremium: true,
        premiumExpiresAt: expiresAt
      },
      { new: true }
    );

    res.json({
      user: user.getProfile(),
      message: 'Upgraded to premium successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check premium status
const checkPremiumStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const isActive = user.isPremiumActive();

    res.json({
      isPremium: user.isPremium,
      expiresAt: user.premiumExpiresAt,
      isActive
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel premium
const cancelPremium = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        isPremium: false,
        premiumExpiresAt: null
      },
      { new: true }
    );

    res.json({
      user: user.getProfile(),
      message: 'Premium cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  upgradeToPremium,
  checkPremiumStatus,
  cancelPremium
};