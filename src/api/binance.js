import axios from 'axios';

const BINANCE_API_URL = 'https://fapi.binance.com/fapi/v1';

export const fetchFutureContractPrices = async (crypto) => {
  try {
    const response = await axios.get(`${BINANCE_API_URL}/premiumIndex?symbol=${crypto}USDT`);
    const { markPrice, lastFundingRate } = response.data;
    return {
      perpetual: markPrice,
      quarterly: markPrice * (1 + lastFundingRate),
      biquarterly: markPrice * (1 + 2 * lastFundingRate),
    };
  } catch (error) {
    console.error('Error fetching future contract prices:', error);
    return { perpetual: 0, quarterly: 0, biquarterly: 0 };
  }
};

export const fetchHistoricalPrices = async (crypto, days) => {
  try {
    const endTime = Date.now();
    const startTime = endTime - days * 24 * 60 * 60 * 1000;
    const response = await axios.get(
      `${BINANCE_API_URL}/klines?symbol=${crypto}USDT&interval=1d&startTime=${startTime}&endTime=${endTime}`
    );
    return response.data.map((price) => ({
      date: new Date(price[0]).toLocaleDateString(),
      value: price[4],
    }));
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return [];
  }
};
