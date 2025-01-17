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
      perpetualQuarterly: {
        value: perpetual - quarterly,
        percentage: ((perpetual - quarterly) / perpetual) * 100,
      },
      perpetualBiquarterly: {
        value: perpetual - biquarterly,
        percentage: ((perpetual - biquarterly) / perpetual) * 100,
      },
      quarterlyBiquarterly: {
        value: quarterly - biquarterly,
        percentage: ((quarterly - biquarterly) / quarterly) * 100,
      },
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

  const formatPrice = (price) => {
    return `$${Number(price).toFixed(2)}`;
  };

  const formatChange = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(2);
  };

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
        <p>Perpetual: {formatPrice(futurePrices.perpetual)}</p>
        <p>Quarterly: {formatPrice(futurePrices.quarterly)} ({formatChange(futurePrices.quarterly, futurePrices.perpetual)}%)</p>
        <p>Biquarterly: {formatPrice(futurePrices.biquarterly)} ({formatChange(futurePrices.biquarterly, futurePrices.perpetual)}%)</p>
      </div>
      <div>
        <h2>Spread</h2>
        <p>Perpetual - Quarterly: {formatPrice(computeSpread(futurePrices).perpetualQuarterly.value)} ({computeSpread(futurePrices).perpetualQuarterly.percentage.toFixed(2)}%)</p>
        <p>Perpetual - Biquarterly: {formatPrice(computeSpread(futurePrices).perpetualBiquarterly.value)} ({computeSpread(futurePrices).perpetualBiquarterly.percentage.toFixed(2)}%)</p>
        <p>Quarterly - Biquarterly: {formatPrice(computeSpread(futurePrices).quarterlyBiquarterly.value)} ({computeSpread(futurePrices).quarterlyBiquarterly.percentage.toFixed(2)}%)</p>
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
