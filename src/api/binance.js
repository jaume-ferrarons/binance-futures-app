import axios from 'axios';

const BASE_URL = 'https://fapi.binance.com';

export const fetchFutureContractPrices = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/fapi/v1/premiumIndex?symbol=${symbol}`);
    const data = response.data;
    return {
      perpetual: data[0].markPrice,
      quarterly: data[1].markPrice,
      biquarterly: data[2].markPrice,
    };
  } catch (error) {
    console.error('Error fetching future contract prices:', error);
    return {};
  }
};

export const fetchHistoricalPrices = async (symbol, days) => {
  try {
    const endTime = Date.now();
    const startTime = endTime - days * 24 * 60 * 60 * 1000;
    const response = await axios.get(`${BASE_URL}/fapi/v1/klines?symbol=${symbol}&interval=1d&startTime=${startTime}&endTime=${endTime}`);
    const data = response.data;
    return data.map((item) => ({
      date: new Date(item[0]).toLocaleDateString(),
      value: item[4],
    }));
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return [];
  }
};
