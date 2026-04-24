const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['audio', 'video'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed', 'missed', 'rejected'],
    default: 'pending'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  duration: Number, // in seconds
  recordingUrl: String,
  didAnswer: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

callSchema.index({ caller: 1, receiver: 1 });

module.exports = mongoose.model('Call', callSchema);
