import axios from 'axios';

const BINANCE_API_URL = 'https://fapi.binance.com/fapi/v1';

const getQuarterlyAndBiquarterlyNames = async (crypto) => {
  try {
    const response = await axios.get(`${BINANCE_API_URL}/exchangeInfo`);
    const symbols = response.data.symbols;
    const quarterly = symbols.find(
      (symbol) => symbol.symbol.startsWith(crypto) && symbol.contractType === 'CURRENT_QUARTER'
    );
    const biquarterly = symbols.find(
      (symbol) => symbol.symbol.startsWith(crypto) && symbol.contractType === 'NEXT_QUARTER'
    );
    return {
      quarterly: quarterly ? quarterly.symbol : null,
      biquarterly: biquarterly ? biquarterly.symbol : null,
    };
  } catch (error) {
    console.error('Error fetching quarterly and biquarterly names:', error);
    return { quarterly: null, biquarterly: null };
  }
};

export const fetchFutureContractPrices = async (crypto) => {
  try {
    const { quarterly, biquarterly } = await getQuarterlyAndBiquarterlyNames(crypto);

    const perpetualResponse = await axios.get(`${BINANCE_API_URL}/premiumIndex?symbol=${crypto}USDT`);
    const perpetualPrice = Number(perpetualResponse.data.markPrice);

    const quarterlyResponse = quarterly
      ? await axios.get(`${BINANCE_API_URL}/premiumIndex?symbol=${quarterly}`)
      : { data: { markPrice: '0' } };
    const quarterlyPrice = Number(quarterlyResponse.data.markPrice);

    const biquarterlyResponse = biquarterly
      ? await axios.get(`${BINANCE_API_URL}/premiumIndex?symbol=${biquarterly}`)
      : { data: { markPrice: '0' } };
    const biquarterlyPrice = Number(biquarterlyResponse.data.markPrice);

    return {
      perpetual: perpetualPrice,
      quarterly: quarterlyPrice,
      biquarterly: biquarterlyPrice,
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
