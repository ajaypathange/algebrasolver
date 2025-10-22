# AlgebraSolver - Setup and Run Instructions

## Project Structure

\`\`\`
algebra-solver/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env (optional)
│
├── backend/                  # Express.js backend server
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env
│
└── SETUP_AND_RUN.md         # This file
\`\`\`

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (local or cloud) - [Download](https://www.mongodb.com/try/download/community)

## Installation & Setup

### Step 1: Clone or Extract the Project

\`\`\`bash
cd algebra-solver
\`\`\`

### Step 2: Setup Backend

\`\`\`bash
cd backend

# Install dependencies
npm install

# Create .env file (if not exists)
# Edit .env and add your MongoDB URI
# Default: MONGODB_URI=mongodb://localhost:27017/algebra-solver
# PORT=5000

# Start the backend server
npm start
# Or for development with auto-reload:
npm run dev
\`\`\`

The backend will run on `http://localhost:5000`

### Step 3: Setup Frontend (in a new terminal)

\`\`\`bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
# REACT_APP_API_URL=http://localhost:5000

# Start the frontend development server
npm start
\`\`\`

The frontend will run on `http://localhost:3000`

## Running the Application

### Prerequisites Check

1. **MongoDB Running**: Make sure MongoDB is running locally or you have a cloud MongoDB URI
   \`\`\`bash
   # For local MongoDB (macOS/Linux)
   mongod
   
   # For local MongoDB (Windows)
   # Start MongoDB from Services or run: mongod
   \`\`\`

2. **Backend Running**: Terminal 1
   \`\`\`bash
   cd backend
   npm start
   \`\`\`
   Expected output: `Server running on port 5000`

3. **Frontend Running**: Terminal 2
   \`\`\`bash
   cd frontend
   npm start
   \`\`\`
   Expected output: Opens browser at `http://localhost:3000`

## Features

### 1. **Equation Solver**
   - Solve linear equations (e.g., `2x + 5 = 13`)
   - Step-by-step solution breakdown
   - Example equations provided

### 2. **Expression Simplifier**
   - Combine like terms
   - Simplify algebraic expressions
   - Visual representation of original vs simplified

### 3. **Graph Visualizer**
   - Plot equations and functions
   - Interactive Recharts visualization
   - Support for various functions (sin, cos, sqrt, etc.)

### 4. **Practice Problems**
   - Randomly generated algebra problems
   - Real-time answer checking
   - Score tracking

### 5. **Progress Tracking**
   - View statistics (total problems, accuracy)
   - Performance charts
   - Recent attempt history

## API Endpoints

### Backend API (http://localhost:5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/solve` | Solve an equation |
| POST | `/api/simplify` | Simplify an expression |
| POST | `/api/graph` | Generate graph data |
| GET | `/api/generateProblem` | Get a random practice problem |
| POST | `/api/checkAnswer` | Check if answer is correct |
| GET | `/api/getHistory` | Get attempt history |

### Example Requests

**Solve Equation:**
\`\`\`bash
curl -X POST http://localhost:5000/api/solve \
  -H "Content-Type: application/json" \
  -d '{"equation": "2x + 5 = 13"}'
\`\`\`

**Simplify Expression:**
\`\`\`bash
curl -X POST http://localhost:5000/api/simplify \
  -H "Content-Type: application/json" \
  -d '{"expression": "2x + 3x + 5"}'
\`\`\`

## Environment Variables

### Backend (.env)
\`\`\`
MONGODB_URI=mongodb://localhost:27017/algebra-solver
PORT=5000
\`\`\`

### Frontend (.env - optional)
\`\`\`
REACT_APP_API_URL=http://localhost:5000
\`\`\`

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
- **Solution**: Ensure MongoDB is running. Start it with `mongod` command.

### Issue: "Backend not responding"
- **Solution**: Check if backend is running on port 5000. Restart with `npm start` in backend folder.

### Issue: "CORS error"
- **Solution**: Backend CORS is configured. Ensure frontend is on `http://localhost:3000`.

### Issue: "Port already in use"
- **Solution**: Change PORT in backend/.env or kill the process using the port.

## Building for Production

### Frontend Build
\`\`\`bash
cd frontend
npm run build
# Creates optimized build in frontend/build folder
\`\`\`

### Backend Deployment
- Deploy backend to services like Heroku, Railway, or AWS
- Update `REACT_APP_API_URL` in frontend to point to production backend
- Ensure MongoDB is accessible from production environment

## Technologies Used

- **Frontend**: React, React Router, Recharts, Axios
- **Backend**: Express.js, Mongoose, MongoDB
- **Styling**: CSS3 with responsive design
- **Math**: Custom equation solver and expression simplifier

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure both frontend and backend are running
4. Check browser console for error messages

---

**Happy Learning with AlgebraSolver!** 🎓
