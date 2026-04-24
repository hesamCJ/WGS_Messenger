# WGS Messenger

A complete React Native messenger application that looks and behaves like Telegram, with both frontend and backend components.

## Features

✅ **Core Messaging**
- 1-on-1 private messages
- Group chats with admin controls
- Real-time message delivery
- Message reactions and emojis
- Message editing and deletion
- Reply to specific messages
- Forward messages

✅ **Calls**
- Audio and video calls
- Call history tracking
- Missed call notifications
- Call status indicators

✅ **Stories & Status**
- Create personal stories
- View stories from contacts
- Story expiration (24 hours)
- Story view tracking
- Hide stories from specific users

✅ **User Management**
- User authentication (register/login)
- Profile editing
- User search
- Contact management
- Block/unblock users
- Status indicators (online/offline/away)

✅ **Advanced Features**
- Typing indicators
- Message read receipts
- Chat archiving
- Chat muting
- Pinned messages
- Device push notifications
- Secure token-based authentication

## Project Structure

```
mobile-shop/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   ├── Chat.js
│   │   ├── Call.js
│   │   ├── Story.js
│   │   └── Channel.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── messageController.js
│   │   ├── chatController.js
│   │   ├── callController.js
│   │   └── storyController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── messages.js
│   │   ├── chats.js
│   │   ├── calls.js
│   │   └── stories.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── App.js
    ├── app.json
    ├── package.json
    └── src/
        ├── navigation/
        │   ├── AuthNavigator.js
        │   └── MainNavigator.js
        ├── screens/
        │   ├── auth/
        │   │   ├── LoginScreen.js
        │   │   ├── RegisterScreen.js
        │   │   └── SplashScreen.js
        │   └── main/
        │       ├── ChatsScreen.js
        │       ├── ChatDetailScreen.js
        │       ├── CallsScreen.js
        │       ├── StoriesScreen.js
        │       ├── ProfileScreen.js
        │       ├── CreateGroupScreen.js
        │       └── SearchScreen.js
        ├── services/
        │   ├── api.js
        │   └── socket.js
        ├── context/
        │   ├── authStore.js
        │   └── chatStore.js
        ├── components/
        │   └── CommonComponents.js
        └── assets/
```

## Installation & Setup

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- Expo CLI
- React Native

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/telegram-messenger
JWT_SECRET=your-secret-key
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```
API_URL=http://localhost:5000/api
SOCKET_URL=http://localhost:5000
```

3. Update the API URLs in `src/services/api.js` and socket service

4. Start the Expo development server:
```bash
npm start
```

5. Run on iOS or Android:
```bash
npm run ios
npm run android
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users
- `GET /api/users/:userId` - Get user by ID
- `POST /api/users/contact/add` - Add contact
- `POST /api/users/block` - Block user
- `POST /api/users/unblock` - Unblock user

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:chatId` - Get messages
- `PUT /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message
- `POST /api/messages/:messageId/react` - Add reaction
- `POST /api/messages/:messageId/read` - Mark as read

### Chats
- `POST /api/chats/private` - Get/create private chat
- `GET /api/chats` - Get all chats
- `POST /api/chats/group` - Create group
- `PUT /api/chats/:chatId` - Update group
- `POST /api/chats/:chatId/member/add` - Add member
- `POST /api/chats/:chatId/leave` - Leave group

### Calls
- `POST /api/calls` - Initiate call
- `POST /api/calls/:callId/answer` - Answer call
- `POST /api/calls/:callId/end` - End call
- `GET /api/calls/:userId/history` - Get call history

### Stories
- `POST /api/stories` - Create story
- `GET /api/stories` - Get stories
- `POST /api/stories/:storyId/view` - View story
- `DELETE /api/stories/:storyId` - Delete story

## Real-time Features (Socket.io)

- `user-online` - User comes online
- `user-offline` - User goes offline
- `private-message` - Send private message
- `group-message` - Send group message
- `typing` - Typing indicator
- `message-read` - Message read receipt
- `call-initiated` - Call initiated
- `incoming-call` - Incoming call notification
- `user-status` - User status changed
- `user-typing` - User typing indicator

## Database Models

### User
- username, email, phone (unique)
- firstName, lastName
- password (hashed with bcrypt)
- avatar, bio
- status (online/offline/away)
- contacts, blockedUsers
- deviceTokens (for notifications)
- settings (notifications, privacy)

### Message
- sender, chat references
- text, image, video, audio, file
- reactions (emoji, userId)
- replyTo, forwardedFrom
- readBy (with timestamp)
- edited, deleted flags

### Chat
- participants array
- isGroupChat, groupName, groupAdmin
- lastMessage reference
- pinnedMessages array
- settings (custom title, theme, wallpaper)

### Call
- caller, receiver references
- type (audio/video)
- status (pending/ongoing/completed/missed)
- duration, recording URL

### Story
- user reference
- media (image/video URL)
- viewedBy array
- expiresAt (24 hours)
- allowedViewers, hiddenFrom

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/telegram-messenger
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=your-key
CLOUDINARY_CLOUD_NAME=your-name
```

### Frontend (.env)
```
API_URL=http://localhost:5000/api
SOCKET_URL=http://localhost:5000
```

## Technologies Used

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Socket.io (real-time)
- JWT (authentication)
- Bcrypt (password hashing)

### Frontend
- React Native
- Expo
- React Navigation
- Zustand (state management)
- Socket.io Client
- Axios (HTTP client)

## Testing

Run backend tests:
```bash
npm test
```

## Deployment

### Backend (Heroku/Railway)
```bash
git push heroku main
```

### Frontend (Expo)
```bash
expo publish
expo build
```

## Security Features

✅ Password hashing with bcrypt
✅ JWT token authentication
✅ Secure token storage in SecureStore
✅ CORS configuration
✅ Input validation
✅ Protected routes with auth middleware
✅ Soft delete for messages
✅ User blocking system

## Future Enhancements

- [ ] End-to-end encryption
- [ ] Video/audio call recording
- [ ] Message search across all chats
- [ ] Dark mode
- [ ] Channel/broadcast lists
- [ ] Bot integration
- [ ] Payments & subscriptions
- [ ] Web version
- [ ] Desktop apps (Electron)
- [ ] Performance optimization

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue in the repository.

---

**Happy coding!** 🚀