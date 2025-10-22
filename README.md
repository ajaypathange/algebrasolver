# Interactive Basic Algebra Solver & Visualizer

A comprehensive web application for learning and practicing basic algebra concepts with interactive visualizations and step-by-step solutions.

## Features

- **Equation Solver**: Solve linear equations with detailed step-by-step explanations
- **Expression Simplifier**: Simplify algebraic expressions and combine like terms
- **Graph Visualizer**: Plot linear equations and visualize systems of equations
- **Practice Problems**: Generate random problems and track your progress
- **Progress Tracking**: View your performance statistics and attempt history

## Tech Stack

- **Frontend**: React 18 + React Router + Recharts
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Styling**: CSS3 with responsive design

## Installation

### Frontend Setup

\`\`\`bash
npm install
npm start
\`\`\`

The app will open at `http://localhost:3000`

### Backend Setup

\`\`\`bash
cd server
npm install
npm start
\`\`\`

The backend will run on `http://localhost:5000`

### Database Setup

Make sure MongoDB is running locally or update the `MONGODB_URI` in `server/.env`

## Usage

1. **Home Page**: Overview of all features
2. **Equation Solver**: Enter equations like `3x + 2 = 11` to get solutions
3. **Expression Simplifier**: Simplify expressions like `2x + 3x - 5`
4. **Graph Visualizer**: Plot equations like `y = 2x + 1`
5. **Practice**: Solve randomly generated problems
6. **Progress**: View your performance statistics

## Example Equations

- Linear: `2x + 3 = 7`
- With negatives: `-2x + 8 = 4`
- Fractions: `0.5x + 2 = 5`

## License

MIT
