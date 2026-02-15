require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const user = require('./Routes/user.Routes'); // Path check kar lena sahi hai na

const app = express();

let isConnected = false;

const connectToMongoDB = async () => {
    // Agar mongoose pehle se connected hai (readyState 1) toh return kar jao
    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
};

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://americanninnmonday.vercel.app'
    ],
    credentials: true
}));

app.use(express.json());

// Database Connection Middleware (Har request se pehle check karega)
app.use(async (req, res, next) => {
    try {
        await connectToMongoDB();
        next();
    } catch (err) {
        res.status(500).json({ error: "Database connection failed" });
    }
});

// Routes
app.use('/munapi', user);

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: 'API is working!',
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Export for Vercel
module.exports = app;