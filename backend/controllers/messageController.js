const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Send message
const sendMessage = async (req, res) => {
  try {
    const { chatId, text, image, video, audio, file, replyTo } = req.body;

    const message = new Message({
      sender: req.userId,
      chat: chatId,
      text,
      image,
      video,
      audio,
      file,
      replyTo
    });

    await message.save();
    await message.populate('sender', 'username avatar');
    
    // Update chat's last message
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a chat
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (page - 1) * limit;

    const messages = await Message.find({ 
      chat: chatId,
      deleted: false,
      deletedFor: { $ne: req.userId } 
    })
      .populate('sender', 'username avatar')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ chat: chatId });

    res.json({
      messages: messages.reverse(),
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit message
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    message.text = text;
    message.edited = true;
    message.editedAt = new Date();
    
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    message.deletedFor.push(req.userId);
    await message.save();

    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// React to message
const reactToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(
      r => r.user.toString() !== req.userId
    );

    // Add new reaction
    if (emoji) {
      message.reactions.push({
        user: req.userId,
        emoji
      });
    }

    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        $addToSet: {
          readBy: {
            user: req.userId,
            readAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forward message
const forwardMessage = async (req, res) => {
  try {
    const { messageId, chatIds } = req.body;

    const originalMessage = await Message.findById(messageId);
    if (!originalMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const forwardedMessages = await Promise.all(
      chatIds.map(chatId =>
        new Message({
          sender: req.userId,
          chat: chatId,
          text: originalMessage.text,
          image: originalMessage.image,
          video: originalMessage.video,
          forwardedFrom: originalMessage._id
        }).save()
      )
    );

    res.status(201).json(forwardedMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search messages
const searchMessages = async (req, res) => {
  try {
    const { query, chatId } = req.query;

    let filter = {
      text: { $regex: query, $options: 'i' },
      deleted: false,
      deletedFor: { $ne: req.userId }
    };

    if (chatId) {
      filter.chat = chatId;
    } else {
      // Search in all user's chats
      const userChats = await Chat.find({
        participants: req.userId
      }).select('_id');
      const chatIds = userChats.map(chat => chat._id);
      filter.chat = { $in: chatIds };
    }

    const messages = await Message.find(filter)
      .populate('sender', 'username avatar')
      .populate('chat', 'name isGroupChat')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  reactToMessage,
  markAsRead,
  forwardMessage,
  searchMessages
};
