import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateRoute from './routes/generateRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Data Parsing Middlewares
// ⬇️ FIX APPLIED HERE: Empty parentheses allow ALL frontend URLs to connect during development
app.use(cors()); 
app.use(express.json());

// API Mounting
app.use('/api', generateRoute);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('💥 Global Server Error:', err.stack);
    res.status(500).json({ error: 'Internal Server Error. Something went wrong on our side.' });
});

app.listen(PORT, () => {
    console.log(`🚀 Premium Backend Server running on http://localhost:${PORT}`);
});