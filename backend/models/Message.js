const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  text: String,
  image: String,
  video: String,
  audio: String,
  file: {
    name: String,
    url: String,
    type: String,
    size: Number
  },
  reactions: [
    {
      user: mongoose.Schema.Types.ObjectId,
      emoji: String,
      _id: false
    }
  ],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  forwardedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  readBy: [
    {
      user: mongoose.Schema.Types.ObjectId,
      readAt: Date,
      _id: false
    }
  ],
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedFor: [mongoose.Schema.Types.ObjectId], // Soft delete for specific users
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

module.exports = mongoose.model('Message', messageSchema);
