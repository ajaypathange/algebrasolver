# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up" and create a free account
3. Verify your email

## Step 2: Create a Cluster
1. Click "Create" to create a new project
2. Select "Build a Database"
3. Choose the **Free** tier (M0)
4. Select your preferred region (closest to your location)
5. Click "Create Cluster" and wait for it to be ready (5-10 minutes)

## Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (save these!)
5. Click "Add User"

## Step 4: Whitelist IP Address
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - For production, add your specific IP
4. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Clusters" and click "Connect"
2. Choose "Drivers"
3. Select "Node.js" and version "4.x or later"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your database user credentials

## Step 6: Update Backend .env
\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/algebra-solver?retryWrites=true&w=majority
PORT=5000
\`\`\`

## Step 7: Test Connection
Run the backend:
\`\`\`bash
cd backend
npm install
npm start
\`\`\`

You should see: "MongoDB connected successfully"

## Database Collections Created Automatically

The application will create these collections:
- **users** - User profiles and statistics
- **attempts** - Individual problem attempts
- **dailystats** - Daily performance statistics
- **sessions** - Study session records

## Viewing Data in MongoDB Atlas

1. Go to "Collections" in your cluster
2. Select the database "algebra-solver"
3. Browse through collections to see your data

## Troubleshooting

**Connection Error?**
- Check username and password in connection string
- Verify IP is whitelisted in Network Access
- Ensure database user has correct permissions

**Data Not Saving?**
- Check backend console for errors
- Verify MONGODB_URI is correct in .env
- Restart the backend server

**Slow Queries?**
- MongoDB Atlas automatically creates indexes
- Check "Performance Advisor" in Atlas dashboard
