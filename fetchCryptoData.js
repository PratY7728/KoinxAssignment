// fetchCryptoData.js
import axios from 'axios';
import Crypto from './db.js';  
export const fetchCryptoData = async () => {
  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=usd&include_market_cap=true&include_24hr_change=true'
    );
    const coins = [
      { id: 'bitcoin', data: data.bitcoin },
      { id: 'ethereum', data: data.ethereum },
      { id: 'matic-network', data: data['matic-network'] }
    ];
    for (const coin of coins) {
      const { usd, usd_market_cap, usd_24h_change } = coin.data;
      const crypto = new Crypto({
        coinId: coin.id,
        price: usd,
        marketCap: usd_market_cap,
        change24h: usd_24h_change
      });
      await crypto.save();
    }
    console.log('Crypto data saved successfully!');
  } catch (error) {
    console.error('Error fetching crypto data:', error);
  }
};
