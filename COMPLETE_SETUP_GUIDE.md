# AlgebraSolver - Complete Setup & Debugging Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier available)
- npm or yarn package manager

## Step 1: MongoDB Atlas Setup

### Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project
4. Create a cluster (M0 free tier is fine)
5. Wait for cluster to be created (5-10 minutes)

### Get Connection String
1. Click "Connect" on your cluster
2. Choose "Drivers" option
3. Select Node.js driver
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<username>` with your database username

### Connection String Format
\`\`\`
mongodb+srv://username:password@cluster-name.mongodb.net/algebra-solver?retryWrites=true&w=majority
\`\`\`

## Step 2: Backend Setup

### 1. Navigate to backend folder
\`\`\`bash
cd backend
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Update .env file
Edit `backend/.env` and add your MongoDB connection string:
\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/algebra-solver?retryWrites=true&w=majority
PORT=5000
\`\`\`

### 4. Start the backend server
\`\`\`bash
npm start
\`\`\`

You should see:
\`\`\`
MongoDB connected successfully
Server running on port 5000
\`\`\`

## Step 3: Frontend Setup

### 1. Navigate to frontend folder (in a new terminal)
\`\`\`bash
cd frontend
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Create .env.local file
Create a file named `.env.local` in the frontend folder:
\`\`\`
REACT_APP_API_URL=http://localhost:5000
\`\`\`

### 4. Start the frontend
\`\`\`bash
npm start
\`\`\`

The app should open at `http://localhost:3000`

## Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:**
1. Make sure backend is running on port 5000
2. Check if MongoDB is connected (look for "MongoDB connected successfully" in backend logs)
3. Verify MONGODB_URI in backend/.env is correct
4. Check firewall settings

### Issue: "Progress page shows 0 for all stats"
**Solution:**
1. Make sure you've answered at least one practice question
2. Check browser console for errors (F12 → Console tab)
3. Check backend logs for errors
4. Verify userId is being generated (check localStorage in browser DevTools)

### Issue: "MongoDB connection error"
**Solution:**
1. Verify connection string is correct
2. Check username and password are correct
3. Make sure IP address is whitelisted in MongoDB Atlas (add 0.0.0.0/0 for development)
4. Ensure database name is included in connection string

### Issue: "CORS error"
**Solution:**
1. Backend CORS is already configured
2. Make sure frontend is on http://localhost:3000
3. Make sure backend is on http://localhost:5000
4. Restart both servers

## Testing the Setup

### 1. Test Backend API
Open browser and go to:
\`\`\`
http://localhost:5000/api/generateProblem
\`\`\`

You should see a JSON response with an equation and answer.

### 2. Test Frontend Connection
1. Open http://localhost:3000
2. Go to Practice page
3. Answer a question and click Submit
4. Check browser console (F12) for logs
5. Go to Progress page - it should show your attempt

### 3. Check MongoDB Data
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. You should see "attempts" collection with your data

## Data Flow

\`\`\`
Practice Page (Frontend)
    ↓
User answers question and clicks Submit
    ↓
POST /api/checkAnswer (Backend)
    ↓
Save to MongoDB
    ↓
Progress Page (Frontend)
    ↓
GET /api/history/:userId (Backend)
    ↓
Fetch from MongoDB
    ↓
Display stats and charts
\`\`\`

## File Structure

\`\`\`
algebra-solver/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── PracticePage.jsx (sends answers to backend)
│   │   │   └── ProgressPage.jsx (fetches progress from backend)
│   │   └── utils/
│   │       └── userUtils.js (generates userId)
│   ├── .env.local (API URL)
│   └── package.json
│
├── backend/
│   ├── server.js (API endpoints)
│   ├── models/ (MongoDB schemas)
│   ├── .env (MongoDB URI)
│   └── package.json
\`\`\`

## API Endpoints

### Generate Problem
\`\`\`
GET /api/generateProblem
Response: { equation: "3x + 2 = 11", answer: 3 }
\`\`\`

### Check Answer
\`\`\`
POST /api/checkAnswer
Body: {
  userId: "user-123",
  equation: "3x + 2 = 11",
  userAnswer: 3,
  correctAnswer: 3,
  problemType: "equation",
  difficulty: "medium"
}
Response: { correct: true, message: "Correct! Great job!" }
\`\`\`

### Get History
\`\`\`
GET /api/history/:userId
Response: {
  attempts: [...],
  pagination: { total: 5, page: 1, limit: 20, pages: 1 }
}
\`\`\`

## Common Commands

### Start Backend
\`\`\`bash
cd backend && npm start
\`\`\`

### Start Frontend
\`\`\`bash
cd frontend && npm start
\`\`\`

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Check Node Version
\`\`\`bash
node --version
\`\`\`

### Check npm Version
\`\`\`bash
npm --version
\`\`\`

## Support

If you encounter issues:
1. Check the browser console (F12 → Console)
2. Check backend logs in terminal
3. Verify all environment variables are set
4. Make sure both servers are running
5. Clear browser cache and reload
