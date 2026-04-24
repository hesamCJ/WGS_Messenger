const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: String,
  lastName: String,
  avatar: String, // URL to profile image
  bio: String,
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  deviceTokens: [String], // For push notifications
  settings: {
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    soundEnabled: {
      type: Boolean,
      default: true
    },
    privacyLevel: {
      type: String,
      enum: ['public', 'contacts', 'private'],
      default: 'contacts'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get user profile (exclude password)
userSchema.methods.getProfile = function() {
  const { password, ...profile } = this.toObject();
  return profile;
};

// Check if premium is active
userSchema.methods.isPremiumActive = function() {
  return this.isPremium && (!this.premiumExpiresAt || this.premiumExpiresAt > new Date());
};


module.exports = mongoose.model('User', userSchema);
