const Call = require('../models/Call');
const User = require('../models/User');

// Initiate call
const initiateCall = async (req, res) => {
  try {
    const { receiverId, type } = req.body; // type: 'audio' or 'video'

    const call = new Call({
      caller: req.userId,
      receiver: receiverId,
      type,
      status: 'pending'
    });

    await call.save();
    await call.populate(['caller', 'receiver'], 'username avatar');

    res.status(201).json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Answer call
const answerCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await Call.findByIdAndUpdate(
      callId,
      {
        status: 'ongoing',
        didAnswer: true
      },
      { new: true }
    ).populate(['caller', 'receiver'], 'username avatar');

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject call
const rejectCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await Call.findByIdAndUpdate(
      callId,
      { status: 'rejected' },
      { new: true }
    );

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// End call
const endCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId);

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    if (call.status === 'pending') {
      call.status = 'missed';
    } else {
      call.status = 'completed';
    }

    call.endTime = new Date();
    call.duration = Math.floor((call.endTime - call.startTime) / 1000);

    await call.save();

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get call history
const getCallHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const calls = await Call.find({
      $or: [
        { caller: userId },
        { receiver: userId }
      ]
    })
      .populate('caller', 'username avatar')
      .populate('receiver', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Call.countDocuments({
      $or: [
        { caller: userId },
        { receiver: userId }
      ]
    });

    res.json({
      calls,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  initiateCall,
  answerCall,
  rejectCall,
  endCall,
  getCallHistory
};
