import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import startCryptoDataJob from './jobs/fetchCryptoData.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Start the background job
startCryptoDataJob();

app.get('/', (req,res) => {
    res.send('Welcome')
})
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});