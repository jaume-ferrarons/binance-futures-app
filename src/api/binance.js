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

export const fetchHistoricalPrices = async (crypto, days, frequency) => {
  try {
    const endTime = Date.now();
    const startTime = endTime - days * 24 * 60 * 60 * 1000;

    const interval = frequency || '1d';

    const perpetualResponse = await axios.get(
      `${BINANCE_API_URL}/klines?symbol=${crypto}USDT&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
    );
    const perpetualPrices = perpetualResponse.data.map((price) => ({
      date: new Date(price[0]).toLocaleDateString(),
      perpetual: price[4],
    }));

    const { quarterly, biquarterly } = await getQuarterlyAndBiquarterlyNames(crypto);

    const quarterlyResponse = quarterly
      ? await axios.get(
          `${BINANCE_API_URL}/klines?symbol=${quarterly}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
        )
      : { data: [] };
    const quarterlyPrices = quarterlyResponse.data.map((price) => ({
      date: new Date(price[0]).toLocaleDateString(),
      quarterly: price[4],
    }));

    const biquarterlyResponse = biquarterly
      ? await axios.get(
          `${BINANCE_API_URL}/klines?symbol=${biquarterly}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
        )
      : { data: [] };
    const biquarterlyPrices = biquarterlyResponse.data.map((price) => ({
      date: new Date(price[0]).toLocaleDateString(),
      biquarterly: price[4],
    }));

    const allDates = Array.from(new Set([
      ...perpetualPrices.map((price) => price.date),
      ...quarterlyPrices.map((price) => price.date),
      ...biquarterlyPrices.map((price) => price.date),
    ])).sort((a, b) => new Date(a) - new Date(b));

    const combinedPrices = allDates.map((date) => {
      const perpetualPrice = perpetualPrices.find((price) => price.date === date);
      const quarterlyPrice = quarterlyPrices.find((price) => price.date === date);
      const biquarterlyPrice = biquarterlyPrices.find((price) => price.date === date);

      return {
        date,
        perpetual: perpetualPrice ? perpetualPrice.perpetual : null,
        quarterly: quarterlyPrice ? quarterlyPrice.quarterly : null,
        biquarterly: biquarterlyPrice ? biquarterlyPrice.biquarterly : null,
      };
    });

    return combinedPrices;
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return [];
  }
};
