import axios from 'axios';

export const convertToUSD = async (amount, currency) => {
    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
      const rates = response.data.rates;
      const usdRate = rates['USD'];
  
      if (!usdRate) {
        throw new Error(`USD rate not found for currency: ${currency}`);
      }
  
      const convertedAmount = amount * usdRate;
  
      return convertedAmount;
    } catch (error) {
      console.error(`Error converting ${currency} to USD:`, error.message);
      throw new Error('Conversion to USD failed. Please try again later.');
    }
  };