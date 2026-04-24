const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wgs-messenger';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Socket.IO Events
const activeUsers = {};
const typingUsers = {};

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User comes online
  socket.on('user-online', (userId) => {
    activeUsers[userId] = socket.id;
    io.emit('user-status', { userId, status: 'online' });
  });

  // User goes offline
  socket.on('disconnect', () => {
    Object.keys(activeUsers).forEach(userId => {
      if (activeUsers[userId] === socket.id) {
        delete activeUsers[userId];
        io.emit('user-status', { userId, status: 'offline' });
      }
    });
    console.log('User disconnected:', socket.id);
  });

  // Private message
  socket.on('private-message', (data) => {
    const { to, message, timestamp } = data;
    if (activeUsers[to]) {
      io.to(activeUsers[to]).emit('receive-message', {
        from: socket.id,
        message,
        timestamp
      });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { chatId, userId, isTyping } = data;
    if (isTyping) {
      typingUsers[chatId] = userId;
    } else {
      delete typingUsers[chatId];
    }
    io.emit('user-typing', { chatId, userId, isTyping });
  });

  // Message read receipt
  socket.on('message-read', (data) => {
    const { messageId, chatId } = data;
    io.emit('message-read-receipt', { messageId, chatId });
  });

  // Call initiated
  socket.on('call-initiated', (data) => {
    const { to, from, type } = data; // type: 'audio' or 'video'
    if (activeUsers[to]) {
      io.to(activeUsers[to]).emit('incoming-call', { from, type });
    }
  });

  // Group message
  socket.on('group-message', (data) => {
    const { groupId, message } = data;
    io.to(`group-${groupId}`).emit('receive-group-message', message);
  });

  // Join group room
  socket.on('join-group', (groupId) => {
    socket.join(`group-${groupId}`);
  });

  // Leave group room
  socket.on('leave-group', (groupId) => {
    socket.leave(`group-${groupId}`);
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/chats', require('./routes/chats'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/calls', require('./routes/calls'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/premium', require('./routes/premium'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io, server };
