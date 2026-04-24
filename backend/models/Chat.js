const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  isGroupChat: {
    type: Boolean,
    default: false
  },
  groupName: String,
  groupDescription: String,
  groupIcon: String,
  groupAdmin: mongoose.Schema.Types.ObjectId,
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  pinnedMessages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],
  mutedFor: [
    {
      user: mongoose.Schema.Types.ObjectId,
      until: Date,
      _id: false
    }
  ],
  archivedFor: [mongoose.Schema.Types.ObjectId],
  customTitle: String, // Custom name for the chat
  theme: {
    color: String,
    wallpaper: String
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

chatSchema.index({ participants: 1 });
chatSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Chat', chatSchema);
