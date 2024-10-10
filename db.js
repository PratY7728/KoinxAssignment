// db.js
import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema({
  coinId: String,
  price: Number,
  marketCap: Number,
  change24h: Number,
  timestamp: { type: Date, default: Date.now }
});

const Crypto = mongoose.model('Crypto', cryptoSchema);
export default Crypto;
