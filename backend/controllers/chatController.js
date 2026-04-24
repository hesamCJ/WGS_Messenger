const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Create or get 1-on-1 chat
const getOrCreateChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.userId;

    if (userId === currentUserId) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    // Find existing chat
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: {
        $all: [currentUserId, userId]
      }
    }).populate('lastMessage').populate('participants', 'username avatar');

    // Create new chat if doesn't exist
    if (!chat) {
      chat = new Chat({
        isGroupChat: false,
        participants: [currentUserId, userId]
      });
      await chat.save();
      await chat.populate('participants', 'username avatar');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all chats
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.userId,
      archivedFor: { $ne: req.userId }
    })
      .populate('participants', 'username avatar status')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create group chat
const createGroup = async (req, res) => {
  try {
    const { groupName, groupDescription, participants } = req.body;

    const chat = new Chat({
      isGroupChat: true,
      groupName,
      groupDescription,
      groupAdmin: req.userId,
      participants: [req.userId, ...participants]
    });

    await chat.save();
    await chat.populate('participants', 'username avatar');

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update group
const updateGroup = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { groupName, groupDescription, groupIcon } = req.body;

    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (chat.groupAdmin.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only admin can update group' });
    }

    chat.groupName = groupName || chat.groupName;
    chat.groupDescription = groupDescription || chat.groupDescription;
    chat.groupIcon = groupIcon || chat.groupIcon;

    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add member to group
const addGroupMember = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (chat.groupAdmin.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only admin can add members' });
    }

    await chat.updateOne({ $addToSet: { participants: userId } });

    await chat.populate('participants', 'username avatar');

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove member from group
const removeGroupMember = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (chat.groupAdmin.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only admin can remove members' });
    }

    await chat.updateOne({ $pull: { participants: userId } });

    await chat.populate('participants', 'username avatar');

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave group
const leaveGroup = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { participants: req.userId } },
      { new: true }
    ).populate('participants', 'username avatar');

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Archive chat
const archiveChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { archivedFor: req.userId } }
    );

    res.json({ message: 'Chat archived' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unarchive chat
const unarchiveChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { archivedFor: req.userId } }
    );

    res.json({ message: 'Chat unarchived' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mute chat
const muteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { duration } = req.body; // in minutes

    const until = new Date(Date.now() + duration * 60 * 1000);

    await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: {
          mutedFor: {
            user: req.userId,
            until
          }
        }
      }
    );

    res.json({ message: 'Chat muted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pin message
const pinMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { messageId } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { pinnedMessages: messageId } },
      { new: true }
    );

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pinned messages
const getPinnedMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({
      _id: { $in: await Chat.findById(chatId).select('pinnedMessages') },
      deleted: false
    }).populate('sender', 'username avatar');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrCreateChat,
  getAllChats,
  createGroup,
  updateGroup,
  addGroupMember,
  removeGroupMember,
  leaveGroup,
  archiveChat,
  unarchiveChat,
  muteChat,
  pinMessage,
  getPinnedMessages
};
