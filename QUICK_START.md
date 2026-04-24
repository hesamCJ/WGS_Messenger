# Quick Start Guide

## 🚀 Getting Started with Telegram Messenger

This guide will help you set up and run the complete Telegram-like messenger application.

### Prerequisites

Before you begin, make sure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [Get MongoDB](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Expo CLI** - `npm install -g expo-cli`
- **Android Studio** or **Xcode** (for mobile testing)

---

## 📦 Backend Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and update:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/telegram-messenger
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRY=7d
NODE_ENV=development
```

### Step 3: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### Step 4: Run Backend Server
```bash
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

✅ Backend is ready at `http://localhost:5000`

---

## 📱 Frontend Setup

### Step 1: Install Dependencies
```bash
cd ../frontend
npm install
```

### Step 2: Configure API URLs
Edit `src/services/api.js` and update:
```javascript
const API_URL = 'http://your-machine-ip:5000/api';
```

Replace `your-machine-ip` with your actual IP address (use `ipconfig` on Windows or `ifconfig` on Mac/Linux)

### Step 3: Start Expo
```bash
npm start
```

### Step 4: Run on Device/Emulator
- **Android**: Press `a` in the terminal
- **iOS**: Press `i` in the terminal
- **Web**: Press `w` in the terminal

---

## 🐳 Docker Setup (Optional)

Run everything with Docker Compose:

```bash
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- Backend on port 5000

---

## 🧪 Testing the App

### Create Test Account
1. Open the app on your device/emulator
2. Go to **Register** screen
3. Enter:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - First Name: `Test`
   - Last Name: `User`

### Test Features
- **Send Messages**: Select a chat and type a message
- **Create Group**: Tap the + button and select members
- **Make Calls**: Tap the phone icon (in production with actual VoIP)
- **Create Story**: Go to Stories tab and create your first story
- **Edit Profile**: Go to Profile tab and update your information

---

## 🔧 Troubleshooting

### Backend won't connect to MongoDB
- Make sure MongoDB is running
- Check connection string in `.env`
- Try: `mongo` in terminal to verify MongoDB

### Frontend can't connect to backend
- Check backend is running on `http://localhost:5000`
- Verify API_URL in `src/services/api.js` matches your machine IP
- Check firewall settings

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5000   # Windows
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🚢 Deployment

### Deploy Backend

**Heroku:**
```bash
cd backend
heroku login
heroku create your-app-name
git push heroku main
```

**Railway.app:**
- Connect GitHub repository
- Select `backend` folder as root
- Set environment variables

### Deploy Frontend

**Expo:**
```bash
expo publish
expo build:android  # or build:ios
```

**Firebase Hosting:**
```bash
npm run build
firebase deploy
```

---

## 📝 API Documentation

### Authentication
```bash
# Register
POST http://localhost:5000/api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Send Message
```bash
POST http://localhost:5000/api/messages
Header: Authorization: Bearer <token>
{
  "chat": "chatId",
  "text": "Hello world!"
}
```

### Get Chats
```bash
GET http://localhost:5000/api/chats
Header: Authorization: Bearer <token>
```

---

## 📚 Project Structure Reference

```
├── backend/
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth, validation
│   └── server.js      # Express app entry
│
├── frontend/
│   ├── src/
│   │   ├── screens/   # App screens
│   │   ├── navigation/# Route navigation
│   │   ├── services/  # API & Socket
│   │   ├── context/   # State management
│   │   └── components/# Reusable UI
│   └── App.js         # App entry point
│
└── docker-compose.yml # Docker setup
```

---

## 🎯 Next Steps

1. ✅ Set up and run the app
2. ✅ Create test accounts
3. ✅ Test messaging features
4. ✅ Deploy to production
5. ✅ Add push notifications (Firebase)
6. ✅ Implement end-to-end encryption
7. ✅ Scale with CDN for media

---

## 📞 Support

For issues and questions:
- Check the README.md in the root folder
- Review API endpoints documentation
- Check browser console for errors
- Check backend logs: `npm run dev`

---

**Made with ❤️ - Happy coding! 🚀**
