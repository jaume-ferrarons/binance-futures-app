import React, { useState, useEffect } from 'react';
import Dropdown from './components/Dropdown';
import Plot from './components/Plot';
import { fetchFutureContractPrices, fetchHistoricalPrices } from './api/binance';

const App = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [futurePrices, setFuturePrices] = useState({ perpetual: 0, quarterly: 0, biquarterly: 0 });
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [selectedDays, setSelectedDays] = useState(7);

  const handleCryptoChange = (event) => {
    setSelectedCrypto(event.target.value);
  };

  const handleDaysChange = (event) => {
    setSelectedDays(event.target.value);
    fetchAndSetHistoricalPrices(event.target.value);
  };

  const fetchPrices = async () => {
    const prices = await fetchFutureContractPrices(selectedCrypto);
    setFuturePrices(prices);
  };

  const computeSpread = (prices) => {
    const { perpetual, quarterly, biquarterly } = prices;
    return {
      perpetualQuarterly: perpetual - quarterly,
      perpetualBiquarterly: perpetual - biquarterly,
      quarterlyBiquarterly: quarterly - biquarterly,
    };
  };

  const fetchAndSetHistoricalPrices = async (days) => {
    const prices = await fetchHistoricalPrices(selectedCrypto, days);
    setHistoricalPrices(prices);
  };

  useEffect(() => {
    fetchPrices();
    fetchAndSetHistoricalPrices(selectedDays);
  }, [selectedCrypto, selectedDays]);

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
        <p>Perpetual - Quarterly: {computeSpread(futurePrices).perpetualQuarterly}</p>
        <p>Perpetual - Biquarterly: {computeSpread(futurePrices).perpetualBiquarterly}</p>
        <p>Quarterly - Biquarterly: {computeSpread(futurePrices).quarterlyBiquarterly}</p>
      </div>
      <Dropdown
        options={[7, 14, 30, 90]}
        selectedValue={selectedDays}
        onChange={handleDaysChange}
      />
      <Plot historicalPrices={historicalPrices} selectedCrypto={selectedCrypto} />
    </div>
  );
};

export default App;
