import React, { useState, useEffect } from 'react';
import Dropdown from './components/Dropdown';
import Plot from './components/Plot';
import { fetchFutureContractPrices, fetchHistoricalPrices } from './api/binance';

const App = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [futurePrices, setFuturePrices] = useState({});
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [days, setDays] = useState(7);

  const handleCryptoChange = (event) => {
    setSelectedCrypto(event.target.value);
  };

  const handleDaysChange = (event) => {
    setDays(event.target.value);
  };

  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await fetchFutureContractPrices(selectedCrypto);
      setFuturePrices(prices);
    };

    fetchPrices();
  }, [selectedCrypto]);

  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await fetchHistoricalPrices(selectedCrypto, days);
      setHistoricalPrices(prices);
    };

    fetchPrices();
  }, [selectedCrypto, days]);

  const computeSpread = (prices) => {
    const { perpetual, quarterly, biquarterly } = prices;
    return {
      perpetualQuarterly: perpetual - quarterly,
      perpetualBiquarterly: perpetual - biquarterly,
      quarterlyBiquarterly: quarterly - biquarterly,
    };
  };

  const spread = computeSpread(futurePrices);

  return (
    <div>
      <h1>Binance Futures Price Comparison</h1>
      <Dropdown
        options={['BTC', 'ETH']}
        selectedValue={selectedCrypto}
        onChange={handleCryptoChange}
      />
      <div>
        <h2>Future Contract Prices</h2>
        <p>Perpetual: {futurePrices.perpetual}</p>
        <p>Quarterly: {futurePrices.quarterly}</p>
        <p>Biquarterly: {futurePrices.biquarterly}</p>
      </div>
      <div>
        <h2>Spread</h2>
        <p>Perpetual - Quarterly: {spread.perpetualQuarterly}</p>
        <p>Perpetual - Biquarterly: {spread.perpetualBiquarterly}</p>
        <p>Quarterly - Biquarterly: {spread.quarterlyBiquarterly}</p>
      </div>
      <Dropdown
        options={[7, 14, 30, 90]}
        selectedValue={days}
        onChange={handleDaysChange}
      />
      <Plot historicalPrices={historicalPrices} selectedCrypto={selectedCrypto} />
    </div>
  );
};

export default App;
