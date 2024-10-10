import express from 'express';
import mongoose from 'mongoose';
import { fetchCryptoData } from './fetchCryptoData.js'; // Import the background task
import Crypto from './db.js';  // Import the Crypto model
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const mongoUri = process.env.DB_URL;
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
    try {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected');
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
    }
  };

  connectDB();

setInterval(fetchCryptoData, 2*60*60*1000); 


fetchCryptoData();

// deviation calculations
const calculateStandardDeviation = (prices) => {
  const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
  const squaredDifferences = prices.map(price => (price - mean) ** 2);
  const variance = squaredDifferences.reduce((acc, sqDiff) => acc + sqDiff, 0) / prices.length;
  return Math.sqrt(variance);
};

// stats route
app.get('/stats', async (req, res) => {
  try {
    const { coin } = req.query;
    const latestCrypto = await Crypto.findOne({ coinId: coin }).sort({ timestamp: -1 });
    if (!latestCrypto) {
      return res.status(404).json({ message: 'No data found for this coin' });
    }
    res.json(latestCrypto);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// deviation route
app.get('/deviation', async (req, res) => {
  try {
    const { coin } = req.query;

    const cryptoData = await Crypto.find({ coinId: coin }).sort({ timestamp: -1 }).limit(100);
    if (cryptoData.length < 2) {
      return res.status(400).json({ message: 'Not enough data for calculation' });
    }
    const prices = cryptoData.map((entry) => entry.price);
    const standardDeviation = calculateStandardDeviation(prices);
    res.json({ standardDeviation });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
