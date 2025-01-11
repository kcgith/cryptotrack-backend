import cron from 'node-cron';
import Crypto from '../models/Crypto.js';
import { fetchCryptoData } from '../services/cryptoService.js';

const startCryptoDataJob = () => {
  cron.schedule('0 */2 * * *', async () => {
    console.log('Fetching crypto data...');
    try {
      const data = await fetchCryptoData();

      // Save or update data in MongoDB
      for (const crypto of data) {
        await Crypto.findOneAndUpdate(
          { name: crypto.name },
          crypto,
          { upsert: true, new: true }
        );
      }
      console.log('Crypto data updated!');
    } catch (err) {
      console.error('Error updating crypto data:', err);
    }
  });
};

export default startCryptoDataJob;