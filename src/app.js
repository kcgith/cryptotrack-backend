import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import startCryptoDataJob from './jobs/fetchCryptoData.js';
import Crypto from './models/Crypto.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Start the background job
startCryptoDataJob();

app.get('/', (req,res) => {
    res.send('Welcome to crypto updates!')
})

app.get('/stats', async (req, res) => {
    const { coin } = req.query;
  
    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid or missing coin parameter.' });
    }
  
    try {
      const crypto = await Crypto.findOne({ name: coin });
  
      if (!crypto) {
        return res.status(404).json({ error: 'Cryptocurrency data not found.' });
      }
  
      res.json({
        price: crypto.price,
        marketCap: crypto.marketCap,
        '24hChange': crypto.change24h,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });
  app.get('/deviation', async (req, res) => {
    const { coin } = req.query;
  
    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid or missing coin parameter.' });
    }
  
    try {
      const records = await Crypto.find({ name: coin }).sort({ updatedAt: -1 }).limit(100);
  
      if (records.length === 0) {
        return res.status(404).json({ error: 'No data available for the requested cryptocurrency.' });
      }
  
      const prices = records.map(record => record.price);
      const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
      const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
      const deviation = Math.sqrt(variance).toFixed(2);
  
      res.json({ deviation: parseFloat(deviation) });
    } catch (err) {
      console.error('Error calculating deviation:', err);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});