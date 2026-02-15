require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const user = require('./Routes/user.Routes');

const app = express();

// CORS middleware
app.use(cors({
    origin: [ 
        'http://localhost:3000',
        'https://americanninnmonday.vercel.app'
    ],
    credentials: true
}));

app.use(express.json());
//MongoDB connection
let isConnected = false;
async function connecttoMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

//
app.use('/munapi', user);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'API is working!' });
});

app.use((req, res, next) => {
if (!isConnected) {
    connecttoMongoDB()
}

next();
})
// Export for Vercel
module.exports = app;