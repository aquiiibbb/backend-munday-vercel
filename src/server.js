require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const user = require("./Routes/user.Routes");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 MongoDB Connection Function
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected Successfully ✅");
    } catch (error) {
        console.error("MongoDB Connection Failed ❌", error);
        throw error;
    }
};

// 🔹 Middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://americanninnmonday.vercel.app"
    ],
    credentials: true
}));

app.use(express.json());

// 🔹 Database Middleware (Important for Vercel)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        return res.status(500).json({ error: "Database connection failed" });
    }
});

// 🔹 Routes
app.use("/munapi", user);

// 🔹 Health Check
app.get("/", (req, res) => {
    res.json({
        message: "API is working 🚀",
        dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
    });
});

// 🔹 Start Server (for local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

// 🔹 Export for Vercel
module.exports = app;