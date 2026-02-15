require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const user = require('./Routes/user.Routes');

const app = express();

// 1. Connection state management (Serverless optimization)
let cachedDb = null;

const connectToMongoDB = async () => {
    // Agar connection pehle se exist karta hai aur state 'connected' hai
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // Naya connection banayein
    try {
        console.log("Connecting to MongoDB...");
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // 5 seconds mein agar connect nahi hua toh error de
        });
        console.log("Database connected successfully");
        return db;
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
};

// 2. Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://americanninnmonday.vercel.app'
    ],
    credentials: true
}));

app.use(express.json());

// 3. Request-based Connection Middleware
app.use(async (req, res, next) => {
    try {
        await connectToMongoDB();
        next();
    } catch (err) {
        res.status(500).json({
            error: "Database connection failed",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// 4. Routes
app.use('/munapi', user);

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: 'API is working!',
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// 5. Local Server Support (Local testing ke liye zaroori hai)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

// 6. Export for Vercel
module.exports = app;